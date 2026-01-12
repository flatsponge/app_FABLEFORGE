"use node";

import { v } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { getAuthUserIdForAction } from "./actionAuthHelpers";
import {
  generateImageUrl,
  generateTextContent,
  getImageApiKey,
  getTextApiKey,
  parseJsonFromContent,
} from "./aiProviders";

// Child-safety negative prompt for Runware/Flux - prevents inappropriate imagery
// Note: Flux doesn't natively support negative prompts, but Runware may use guidance
const CHILD_SAFE_NEGATIVE_PROMPT = "scary, frightening, horror, violent, blood, weapons, gore, death, monsters with sharp teeth, dangerous animals attacking, inappropriate, adult content, nudity, suggestive, human child, human boy, human girl, realistic human faces, photorealistic humans, grotesque, creepy, nightmare, dark threatening shadows, ugly, deformed, bad anatomy, extra limbs, missing limbs, disfigured, mutated, blurry, low quality, watermark, signature, text overlay";

const MORAL_DESCRIPTIONS: Record<string, { name: string; description: string }> = {
  empathy: { name: "Compassion & Empathy", description: "Understanding feelings and caring for others" },
  bravery: { name: "Bravery & Resilience", description: "Finding courage and overcoming challenges" },
  honesty: { name: "Honesty", description: "Valuing truth and integrity" },
  teamwork: { name: "Teamwork", description: "Working together to solve problems" },
  creativity: { name: "Creativity & Imagination", description: "Exploring ideas and creative thinking" },
  gratitude: { name: "Gratitude", description: "Appreciating the good things in life" },
  problemSolving: { name: "Problem Solving", description: "Finding solutions to challenges" },
  responsibility: { name: "Responsibility", description: "Taking ownership of your actions" },
  patience: { name: "Patience", description: "Waiting calmly and practicing self-control" },
  curiosity: { name: "Curiosity", description: "Eagerness to learn and explore" },
};

const PAGE_COUNTS: Record<string, number> = {
  short: 4,
  medium: 6,
  long: 8,
};

const DURATION_MINUTES: Record<string, number> = {
  short: 3,
  medium: 5,
  long: 8,
};

type StoryMode = "creative" | "situation" | "auto";
type StoryLength = "short" | "medium" | "long";
type StoryVibe = "energizing" | "soothing" | "whimsical" | "thoughtful";
type VocabularyLevel = "beginner" | "intermediate" | "advanced";

interface OutlinePoint {
  title: string;
  description: string;
}

interface GeneratedOutline {
  title: string;
  subtitle: string;
  moral: string;
  moralDescription: string;
  points: OutlinePoint[];
}

interface GeneratedPage {
  pageIndex: number;
  text: string;
  imagePrompt: string;
  hasMascot: boolean;
  hasExtraCharacter: boolean;
}

interface GeneratedStory {
  title: string;
  description: string;
  moralDescription: string;
  pages: GeneratedPage[];
}

function buildOutlinePrompt(
  mode: StoryMode,
  prompt: string,
  moral: string,
  storyLength: StoryLength,
  storyVibe: StoryVibe,
  mascotName?: string,
  extraCharacterName?: string,
  locationName?: string
): string {
  const pageCount = PAGE_COUNTS[storyLength];
  const moralInfo = MORAL_DESCRIPTIONS[moral] || { name: moral, description: "" };
  const mascot = mascotName?.trim() || "the mascot";

  const vibeDescriptions: Record<StoryVibe, string> = {
    energizing: "exciting, adventurous, and full of wonder",
    soothing: "calm, gentle, and nurturing",
    whimsical: "playful, magical, and full of delightful surprises",
    thoughtful: "reflective, meaningful, and emotionally resonant",
  };

  const modeInstructions = {
    creative: `Create a wonderfully imaginative story inspired by: "${prompt}"`,
    situation: `Create a comforting, helpful story that gently addresses: "${prompt}"`,
    auto: "Create a delightful, heartwarming surprise story",
  };

  return `You are an award-winning children's book author specializing in stories that nurture young hearts and minds. Create a compelling OUTLINE for a ${pageCount}-page picture book.

${modeInstructions[mode]}

STORY CONTEXT:
- Hero of the story: ${mascot} (the mascot hero; mascots can be any type of character, like a dragon, unicorn, or robot)
${extraCharacterName ? `- Supporting friend: ${extraCharacterName} (a supporting character who joins ${mascot})` : ""}
${locationName ? `- Magical setting: ${locationName}` : ""}
- Core value to teach: ${moralInfo.name} - ${moralInfo.description}
- Emotional tone: ${vibeDescriptions[storyVibe]}

GUIDING PRINCIPLES:
1. The moral lesson must emerge NATURALLY through the story's events, never feel preachy or forced
2. ${mascot} should face a relatable challenge and grow through their choices
3. Keep the focus entirely on ${mascot}; do NOT introduce human child characters
4. If the prompt mentions a child, reinterpret it as ${mascot}'s experience
5. Show, don't tell - let actions and consequences teach the lesson
6. Create moments of wonder, warmth, and gentle humor
7. End with a satisfying resolution that reinforces the positive value

Create exactly ${pageCount} story beats (one per page), building tension in the middle and resolving beautifully.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "title": "An engaging, memorable title",
  "subtitle": "A warm, inviting subtitle that hints at the adventure",
  "moral": "${moralInfo.name}",
  "moralDescription": "A child-friendly explanation of what they will learn",
  "points": [
    { "title": "Beat 1 Title", "description": "One sentence describing what happens" },
    { "title": "Beat 2 Title", "description": "One sentence describing what happens" }
  ]
}`;
}

function buildStoryPrompt(
  job: {
    mode: StoryMode;
    prompt: string;
    moral: string;
    storyLength: StoryLength;
    storyVibe: StoryVibe;
    vocabularyLevel: VocabularyLevel;
    extraCharacterName?: string;
    locationName?: string;
  },
  childContext: { childName: string; childAge: string; gender: string; mascotName?: string | null } | null
): string {
  const pageCount = PAGE_COUNTS[job.storyLength];
  const moralInfo = MORAL_DESCRIPTIONS[job.moral] || { name: job.moral, description: "" };

  const mascotName = childContext?.mascotName?.trim() || "the mascot";
  const mascotPronoun = "they";
  const mascotPossessive = "their";

  const vibeDescriptions: Record<StoryVibe, string> = {
    energizing: "exciting, adventurous, filled with wonder and triumphant moments",
    soothing: "calm, gentle, nurturing, like a warm hug before bedtime",
    whimsical: "playful, magical, sprinkled with delightful surprises and gentle humor",
    thoughtful: "reflective, meaningful, touching the heart with quiet wisdom",
  };

  const vocabDescriptions: Record<VocabularyLevel, string> = {
    beginner: `Language for ages 2-4: Simple words (1-2 syllables), very short sentences (5-8 words), concrete concepts, repetition for comfort, onomatopoeia welcome ("swoosh!", "pop!").`,
    intermediate: `Language for ages 4-6: Moderate vocabulary with some new words to learn, sentences of 8-12 words, simple cause-and-effect, relatable emotions.`,
    advanced: `Language for ages 6-8: Rich vocabulary that stretches understanding, longer flowing sentences, nuanced emotions, metaphors and similes appropriate for children.`,
  };

  const modeInstructions = {
    creative: `Create a wonderfully imaginative story inspired by: "${job.prompt}"
Let your creativity soar while keeping the story grounded in relatable emotions.`,
    situation: `Create a therapeutic story that helps ${mascotName} process and cope with: "${job.prompt}"`,
    auto: `Create a heartwarming story that celebrates childhood wonder and curiosity.`,
  };

  // Comprehensive therapeutic guidelines for situation mode
  const therapeuticGuidelines = job.mode === 'situation' ? `
═══════════════════════════════════════
      THERAPEUTIC STORY APPROACH
═══════════════════════════════════════

A parent has shared this real-life challenge: "${job.prompt}"

YOUR MISSION: Create a story that helps ${mascotName} process this experience safely and learn from it positively.

📋 SITUATION ANALYSIS:
First, identify what the mascot is experiencing:
- What is the CORE EMOTION? (fear, anger, sadness, anxiety, jealousy, confusion, embarrassment)
- What NEED might be unmet? (safety, belonging, control, understanding, comfort, validation)
- What SKILL could help? (communication, self-regulation, empathy, bravery, acceptance, problem-solving)

🛡️ THERAPEUTIC STORYTELLING PRINCIPLES:
1. VALIDATE ${mascotName}'s feelings - feelings are NEVER wrong, even if the behavior was
2. NORMALIZE the experience - "many characters feel this way, it's okay"
3. REFRAME the challenge - from scary/bad to something they can grow through
4. MODEL healthy responses - show ${mascotName} using gentle, age-appropriate coping strategies
5. EMPOWER with agency - ${mascotName} can make positive choices going forward
6. ENSURE HOPE - the story ends with connection, understanding, and a path forward

⚠️ CRITICAL SAFETY RULES FOR SENSITIVE TOPICS:
- NEVER blame or shame ${mascotName} for the situation or ${mascotPossessive} feelings
- NEVER make "wrong" behavior seem exciting, fun, or rewarded in the story
- NEVER dismiss, minimize, or mock the mascot's emotions
- NEVER include scary consequences or punishments
- ALWAYS show caring figures who are helpful, patient, and understanding
- ALWAYS end with reconciliation, hope, and ${mascotName} feeling loved
- If the topic involves conflict, focus on REPAIR and UNDERSTANDING, not who was "right"

🎯 STORY STRUCTURE FOR REAL-LIFE SITUATIONS:
Page 1: Establish ${mascotName}'s world and show ${mascotPronoun} is loved
Page 2: The challenge appears (mirror the real situation through metaphor or directly)
Page 3: ${mascotName} feels the difficult emotions - VALIDATE these fully
Page 4: A caring figure (friend, mentor, or wise character) offers gentle support
Page 5+: ${mascotName} discovers a way forward, makes a positive choice
Final Page: Resolution, reconnection with loved ones, and ${mascotName} feeling capable and loved

💡 METAPHOR GUIDANCE FOR COMMON SITUATIONS:
- Conflict/fight → Focus on how words can hurt AND heal, show repair and forgiveness
- Doctor/dentist visit → The helper is friendly, the experience is manageable, bravery is rewarded
- New sibling → Hearts grow bigger, there's enough love for everyone
- Fear (dark, monsters) → Fears become friends, ${mascotName} finds inner courage
- Loss/grief → Loved ones live on in memories and hearts, it's okay to feel sad
- Starting school → New places become familiar, new friends are waiting to be found
- Sharing difficulties → Joy multiplies when shared, taking turns feels good
- Big emotions/tantrums → Feelings are like weather, they pass, and ${mascotName} learns to cope
` : '';

  const locationContext = job.locationName
    ? `The adventure unfolds in ${job.locationName} - bring this setting to vivid life with sensory details.`
    : job.mode === 'situation'
      ? "Choose a setting that is safe, familiar, and comforting to young children."
      : "Choose a setting that feels magical yet relatable to young children.";

  // The mascot is ALWAYS the hero of the story
  const mascotContext = `MASCOT HERO: ${mascotName}
${mascotName} is the main character who goes on the adventure. This hero should:
  - Drive the story's choices, actions, and discoveries
  - Show emotions and growth as the story unfolds
  - Solve problems with creativity and courage
  - Be present throughout the story (most/all pages)
  - Remain the focus of the narrative; do NOT introduce a human child`;

  // Extra character is an additional friend beyond the mascot
  const extraCharacterContext = job.extraCharacterName
    ? `ADDITIONAL FRIEND: ${job.extraCharacterName} joins ${mascotName} as a supporting character.`
    : "";

  return `You are an acclaimed children's picture book author whose stories are treasured by families worldwide. Your gift is creating tales that children BEG to hear again and again - stories that make them feel brave, loved, and capable.

${modeInstructions[job.mode]}
${therapeuticGuidelines}
═══════════════════════════════════════
          THE HEART OF THE STORY
═══════════════════════════════════════

HERO: ${mascotName}
This is the reader's story about ${mascotName}. Make ${mascotPronoun} feel heroic, capable, and deeply loved.
Do NOT introduce a human child or child companion.
If the input mentions a child, reinterpret it as ${mascotName}'s experience.

${mascotContext}

${extraCharacterContext}

${locationContext}

CORE VALUE: ${moralInfo.name}
${moralInfo.description}

═══════════════════════════════════════
          STORYTELLING PRINCIPLES
═══════════════════════════════════════

🌟 MORAL TEACHING (CRITICAL):
- The lesson must emerge through STORY EVENTS, not lectures
- Show ${mascotName} making a CHOICE that reflects the value
- Include a NATURAL CONSEQUENCE that reinforces why this value matters
- The hero should FEEL the truth of the lesson, not just hear it
- Example: Don't say "Sharing is good." Instead, show ${mascotName} sharing ${mascotPossessive} last cookie, seeing a friend's face light up, and feeling warm inside.

🎭 EMOTIONAL JOURNEY:
- Page 1-2: Establish ${mascotName}'s world, then introduce a challenge or desire
- Middle pages: Build tension through obstacles, show growth through small choices
- Final pages: Satisfying resolution where the moral naturally shines through

✨ CREATIVE ELEMENTS:
- Sensory details: What does ${mascotName} see, hear, feel, smell?
- Moments of wonder that make children gasp with delight
- Gentle humor appropriate for young children
- Rhythm and flow that's pleasing when read aloud

💝 EMOTIONAL SAFETY:
- The world is ultimately safe and good
- Challenges are overcome, fears are conquered
- Love and connection triumph
- End on a note of warmth, hope, and security

═══════════════════════════════════════
          WRITING REQUIREMENTS
═══════════════════════════════════════

TONE: ${vibeDescriptions[job.storyVibe]}

${vocabDescriptions[job.vocabularyLevel]}

STRUCTURE:
- Exactly ${pageCount} pages
- Each page: 2-4 sentences (perfect for picture book pacing)
- Each page should have ONE clear visual moment
- Text must work when read aloud by a parent

═══════════════════════════════════════
          IMAGE PROMPTS (CRITICAL)
═══════════════════════════════════════

IMPORTANT: The mascot character (from the reference image) is the HERO of the illustrations. 
The mascot can be any creature - animal, dragon, unicorn, robot, magical being, etc.
NO human children appear in the images - only the mascot character goes on adventures.

For each page, create a detailed illustration prompt following this structure:
SUBJECT + ACTION + SETTING + LIGHTING/MOOD

Each imagePrompt MUST include:
1. WHO: "The friendly character from the reference image" with specific pose and expression (smiling proudly, looking curious, eyes wide with wonder)
2. WHAT: The specific action being performed (running through, reaching toward, hugging, discovering, jumping over)
3. WHERE: Detailed setting with specific environmental elements (cozy treehouse interior, sunny meadow with wildflowers, moonlit pond with lily pads)
4. ATMOSPHERE: Lighting quality and color mood (warm golden sunlight, soft pink sunset glow, magical sparkles floating in air)

EXAMPLE imagePrompt: "The friendly character from the reference image with wide excited eyes, reaching toward a glowing butterfly, standing in an enchanted garden with oversized colorful flowers and mushrooms, warm dappled sunlight filtering through giant leaves, magical dust particles floating in the air"

DO NOT include:
- Character names (the image model doesn't know names)  
- Human children (the mascot is the main character)
- Abstract concepts without visual representation
- Style instructions (these are added separately)

RESPOND IN THIS EXACT JSON FORMAT:
{
  "title": "An engaging, memorable title",
  "description": "A one-sentence summary that captures the story's heart",
  "moralDescription": "What children will learn and feel from this story",
  "pages": [
    {
      "pageIndex": 0,
      "text": "Story text for this page...",
      "imagePrompt": "Detailed illustration prompt following the structure above...",
      "hasMascot": true,
      "hasExtraCharacter": false
    }
  ]
}

IMPORTANT FLAGS:
- "hasMascot": Set to TRUE for every page (the mascot appears in every scene)
- "hasExtraCharacter": Set to TRUE only if the additional friend character appears on this page`;
}

function buildImagePrompt(
  basePrompt: string,
  hasMascot: boolean,
  mascotUrl: string | null,
  storyVibe?: string
): string {
  // Flux-optimized vibe styles: specific visual descriptions, lighting, color palette
  const vibeStyles: Record<string, string> = {
    energizing: "vibrant saturated colors, dynamic diagonal composition, bright warm sunshine, lens flare effects, high energy atmosphere",
    soothing: "soft pastel color palette, gentle diffused lighting, dreamy bokeh background, calm serene atmosphere, muted shadows",
    whimsical: "magical glowing particles, iridescent sparkles, candy-bright colors, fantastical floating elements, enchanted forest atmosphere",
    thoughtful: "warm amber earth tones, golden hour soft lighting, shallow depth of field, intimate emotional atmosphere, cozy indoor or sunset setting",
  };

  const vibeStyle = storyVibe && vibeStyles[storyVibe] ? vibeStyles[storyVibe] : "warm inviting color palette, soft natural lighting";

  // Flux prompt structure: Subject + Action + Style + Context
  // Reference image instruction for mascot consistency - mascot is the main hero
  const mascotInstruction = hasMascot && mascotUrl
    ? "The mascot character from the reference image is the main subject, maintaining exact appearance, proportions, colors, and any clothing or accessories."
    : "";
  const noHumanInstruction = "No human children or human companions appear in the scene.";

  // Core style for children's book illustration - Flux-optimized
  const styleGuide = `Children's picture book illustration style, soft watercolor textures with clean linework, rounded friendly character designs, large expressive eyes, ${vibeStyle}, professional publishing quality, detailed whimsical background elements, no text or typography in image`;

  return `${basePrompt}. ${mascotInstruction} ${noHumanInstruction} ${styleGuide}`.replace(/\s+/g, " ").trim();
}

function buildTeaserImageBasePrompt(args: {
  prompt: string;
}): string {
  const safePrompt = args.prompt.replace(/\s+/g, " ").trim();

  return `The friendly character from the reference image in a magical adventure scene, inspired by: ${safePrompt}. The character stands heroically in an enchanted setting, warm golden hour lighting, magical sparkles and soft glow in the air, whimsical background with fantastical elements.`;
}

async function generatePageImage(
  apiKey: string,
  prompt: string,
  referenceImages: string[]
): Promise<{ imageUrl: string | null }> {
  try {
    const imageUrl = await generateImageUrl(apiKey, {
      positivePrompt: prompt,
      negativePrompt: CHILD_SAFE_NEGATIVE_PROMPT,
      referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
    });

    return { imageUrl };
  } catch (error) {
    console.error("Image generation error:", error);
    return { imageUrl: null };
  }
}

export const generateStory = internalAction({
  args: { jobId: v.id("storyJobs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const job = await ctx.runQuery(internal.storyGeneration.getJob, { jobId: args.jobId });
    if (!job) {
      await ctx.runMutation(internal.storyGeneration.updateJobProgress, {
        jobId: args.jobId,
        status: "failed",
        error: "Job not found",
      });
      return null;
    }

    await ctx.runMutation(internal.storyGeneration.updateJobProgress, {
      jobId: args.jobId,
      status: "generating_story",
      progress: 5,
    });

    const childContext = await ctx.runQuery(internal.storyGeneration.getChildContext, {
      userId: job.userId,
    });

    const openRouterApiKey = getTextApiKey();
    if (!openRouterApiKey) {
      await ctx.runMutation(internal.storyGeneration.updateJobProgress, {
        jobId: args.jobId,
        status: "failed",
        error: "OpenRouter API not configured",
      });
      return null;
    }

    try {
      const prompt = buildStoryPrompt(
        {
          mode: job.mode as StoryMode,
          prompt: job.prompt,
          moral: job.moral,
          storyLength: job.storyLength as StoryLength,
          storyVibe: job.storyVibe as StoryVibe,
          vocabularyLevel: job.vocabularyLevel as VocabularyLevel,
          extraCharacterName: job.extraCharacterName,
          locationName: job.locationName,
        },
        childContext
      );

      const content = await generateTextContent(openRouterApiKey, {
        messages: [
          {
            role: "system",
            content: "You are an award-winning children's book author. Always respond with valid JSON only, no additional text or markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        title: "Storytime",
      });

      let story: GeneratedStory;
      try {
        story = parseJsonFromContent<GeneratedStory>(content, /\{[\s\S]*?"title"[\s\S]*\}/);
      } catch {
        console.error("Story generation - Failed to parse JSON from content:", content);
        throw new Error("Failed to parse story JSON");
      }

      await ctx.runMutation(internal.storyGeneration.updateJobProgress, {
        jobId: args.jobId,
        progress: 20,
      });

      const bookId: Id<"books"> = await ctx.runMutation(internal.storyGeneration.createBook, {
        jobId: args.jobId,
        title: story.title,
        description: story.description,
        moral: job.moral,
        moralDescription: story.moralDescription,
        pageCount: story.pages.length,
        storyLength: job.storyLength as StoryLength,
        vocabularyLevel: job.vocabularyLevel as VocabularyLevel,
        storyVibe: job.storyVibe as StoryVibe,
        durationMinutes: DURATION_MINUTES[job.storyLength] || 5,
      });

      const pageIds: Array<{ pageId: Id<"bookPages">; page: GeneratedPage }> = [];

      for (const page of story.pages) {
        const pageId: Id<"bookPages"> = await ctx.runMutation(internal.storyGeneration.createBookPage, {
          bookId,
          jobId: args.jobId,
          pageIndex: page.pageIndex,
          text: page.text,
          imagePrompt: page.imagePrompt,
          hasMascot: page.hasMascot,
          hasExtraCharacter: page.hasExtraCharacter,
        });
        pageIds.push({ pageId, page });
      }

      await ctx.runMutation(internal.storyGeneration.updateJobProgress, {
        jobId: args.jobId,
        status: "generating_images",
        progress: 25,
        bookId,
      });

      const runwareApiKey = getImageApiKey();
      if (!runwareApiKey) {
        await ctx.runMutation(internal.storyGeneration.updateJobProgress, {
          jobId: args.jobId,
          status: "complete",
          progress: 100,
        });
        return null;
      }

      let mascotUrl: string | null = null;
      if (job.mascotStorageId) {
        mascotUrl = await ctx.storage.getUrl(job.mascotStorageId);
      }

      const totalPages = pageIds.length;
      for (let i = 0; i < pageIds.length; i++) {
        const { pageId, page } = pageIds[i];
        const progressPercent = 25 + Math.floor((i / totalPages) * 70);

        try {
          const imagePrompt = buildImagePrompt(page.imagePrompt, page.hasMascot, mascotUrl, job.storyVibe);

          const referenceImages: string[] = [];
          if (page.hasMascot && mascotUrl) {
            referenceImages.push(mascotUrl);
          }

          const imageResult = await generatePageImage(
            runwareApiKey,
            imagePrompt,
            referenceImages
          );

          if (imageResult.imageUrl) {
            const imageResponse = await fetch(imageResult.imageUrl);
            if (imageResponse.ok) {
              const imageBlob = await imageResponse.blob();
              const storageId = await ctx.storage.store(imageBlob);

              await ctx.runMutation(internal.storyGeneration.updatePageImage, {
                pageId,
                imageStorageId: storageId,
              });

              if (i === 0) {
                await ctx.runMutation(internal.storyGeneration.updateBookCover, {
                  bookId,
                  coverImageStorageId: storageId,
                });
              }
            }
          }
        } catch (imageError) {
          console.error(`Failed to generate image for page ${i}:`, imageError);
        }

        await ctx.runMutation(internal.storyGeneration.updateJobProgress, {
          jobId: args.jobId,
          progress: progressPercent,
        });
      }

      await ctx.runMutation(internal.storyGeneration.updateJobProgress, {
        jobId: args.jobId,
        status: "complete",
        progress: 100,
      });
    } catch (error) {
      console.error("Story generation failed:", error);
      await ctx.runMutation(internal.storyGeneration.updateJobProgress, {
        jobId: args.jobId,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return null;
  },
});

export const generateOnboardingTeaserImage = internalAction({
  args: { teaserId: v.id("onboardingTeasers") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const teaser = await ctx.runQuery(internal.storyGeneration.getOnboardingTeaserById, {
      teaserId: args.teaserId,
    });

    if (!teaser) {
      console.error("Onboarding teaser image - Teaser not found:", args.teaserId);
      return null;
    }

    if (teaser.teaserImageStatus === "complete" && teaser.teaserImageStorageId) {
      return null;
    }

    if (teaser.teaserImageStatus === "generating") {
      return null;
    }

    if (!teaser.mascotStorageId) {
      await ctx.runMutation(internal.storyGeneration.updateOnboardingTeaser, {
        teaserId: args.teaserId,
        teaserImageStatus: "failed",
        teaserImageError: "Mascot not available",
      });
      return null;
    }

    const runwareApiKey = getImageApiKey();
    if (!runwareApiKey) {
      await ctx.runMutation(internal.storyGeneration.updateOnboardingTeaser, {
        teaserId: args.teaserId,
        teaserImageStatus: "failed",
        teaserImageError: "Image generation service not configured",
      });
      return null;
    }

    await ctx.runMutation(internal.storyGeneration.updateOnboardingTeaser, {
      teaserId: args.teaserId,
      teaserImageStatus: "generating",
    });

    try {
      const mascotUrl = await ctx.storage.getUrl(teaser.mascotStorageId);
      if (!mascotUrl) {
        await ctx.runMutation(internal.storyGeneration.updateOnboardingTeaser, {
          teaserId: args.teaserId,
          teaserImageStatus: "failed",
          teaserImageError: "Failed to load mascot reference",
        });
        return null;
      }

      const basePrompt = buildTeaserImageBasePrompt({
        prompt: teaser.prompt,
      });

      const imagePrompt = buildImagePrompt(basePrompt, true, mascotUrl, "soothing");
      const imageResult = await generatePageImage(runwareApiKey, imagePrompt, [mascotUrl]);

      if (!imageResult.imageUrl) {
        await ctx.runMutation(internal.storyGeneration.updateOnboardingTeaser, {
          teaserId: args.teaserId,
          teaserImageStatus: "failed",
          teaserImageError: "Failed to generate teaser image",
        });
        return null;
      }

      const imageResponse = await fetch(imageResult.imageUrl);
      if (!imageResponse.ok) {
        await ctx.runMutation(internal.storyGeneration.updateOnboardingTeaser, {
          teaserId: args.teaserId,
          teaserImageStatus: "failed",
          teaserImageError: "Failed to download teaser image",
        });
        return null;
      }

      const imageBlob = await imageResponse.blob();
      const storageId = await ctx.storage.store(imageBlob);

      await ctx.runMutation(internal.storyGeneration.updateOnboardingTeaser, {
        teaserId: args.teaserId,
        teaserImageStatus: "complete",
        teaserImageStorageId: storageId,
      });
    } catch (error) {
      console.error("Onboarding teaser image - Generation failed:", error);
      await ctx.runMutation(internal.storyGeneration.updateOnboardingTeaser, {
        teaserId: args.teaserId,
        teaserImageStatus: "failed",
        teaserImageError: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return null;
  },
});

export const generateOutline = action({
  args: {
    mode: v.union(v.literal("creative"), v.literal("situation"), v.literal("auto")),
    prompt: v.string(),
    storyLength: v.union(v.literal("short"), v.literal("medium"), v.literal("long")),
    storyVibe: v.union(
      v.literal("energizing"),
      v.literal("soothing"),
      v.literal("whimsical"),
      v.literal("thoughtful")
    ),
    moral: v.optional(v.string()),
    extraCharacterName: v.optional(v.string()),
    locationName: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    outline: v.optional(
      v.object({
        title: v.string(),
        subtitle: v.string(),
        moral: v.string(),
        moralDescription: v.string(),
        points: v.array(
          v.object({
            title: v.string(),
            description: v.string(),
          })
        ),
      })
    ),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdForAction(ctx);
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const openRouterApiKey = getTextApiKey();
    if (!openRouterApiKey) {
      return { success: false, error: "API not configured" };
    }

    const childContext = await ctx.runQuery(internal.storyGeneration.getChildContext, {
      userId: userId as Id<"users">,
    });

    const mascotName = childContext?.mascotName?.trim() || undefined;
    const moral = args.moral || "empathy";

    const prompt = buildOutlinePrompt(
      args.mode as StoryMode,
      args.prompt,
      moral,
      args.storyLength as StoryLength,
      args.storyVibe as StoryVibe,
      mascotName,
      args.extraCharacterName,
      args.locationName
    );

    try {
      const content = await generateTextContent(openRouterApiKey, {
        messages: [
          {
            role: "system",
            content: "You are an award-winning children's book author. Always respond with valid JSON only, no additional text or markdown.",
          },
          { role: "user", content: prompt },
        ],
        title: "Storytime",
      });

      let outline: GeneratedOutline;
      try {
        outline = parseJsonFromContent<GeneratedOutline>(content, /\{[\s\S]*?"title"[\s\S]*\}/);
      } catch {
        console.error("Outline generation - Failed to parse JSON from content:", content);
        return { success: false, error: "Failed to parse outline" };
      }

      return {
        success: true,
        outline: {
          title: outline.title,
          subtitle: outline.subtitle || "",
          moral: outline.moral,
          moralDescription: outline.moralDescription,
          points: outline.points,
        },
      };
    } catch (error) {
      console.error("Outline generation failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// ============================================
// ONBOARDING TEASER GENERATION
// ============================================

/**
 * Generates a short story teaser during onboarding.
 * Fixed settings: friendship moral, soothing vibe, 4 pages
 * Generates title + first page text and queues teaser image when possible
 */
export const generateOnboardingTeaser = action({
  args: {
    prompt: v.string(),
    childName: v.string(),
    childAge: v.string(),
    gender: v.string(),
    email: v.string(),
    mascotName: v.optional(v.string()),
    mascotStorageId: v.optional(v.id("_storage")),
  },
  returns: v.object({
    success: v.boolean(),
    teaserId: v.optional(v.id("onboardingTeasers")),
    teaser: v.optional(
      v.object({
        title: v.string(),
        teaserText: v.string(),
      })
    ),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args): Promise<{
    success: boolean;
    teaserId?: Id<"onboardingTeasers">;
    teaser?: { title: string; teaserText: string };
    error?: string;
  }> => {
    const authUserId = await getAuthUserIdForAction(ctx);
    const resolvedUserId = authUserId ? (authUserId as Id<"users">) : undefined;

    // Check if teaser already exists for this email - return existing instead of regenerating
    const existingTeaser: {
      _id: Id<"onboardingTeasers">;
      title: string;
      description: string;
      teaserText: string;
      prompt: string;
      childName: string;
      childAge: string;
      gender: string;
      mascotStorageId: Id<"_storage"> | null;
      teaserImageStatus: "queued" | "generating" | "complete" | "failed" | null;
      fullStoryGenerated: boolean;
      linkedBookId?: Id<"books">;
    } | null = await ctx.runQuery(
      internal.storyGeneration.getOnboardingTeaserByEmail,
      { email: args.email }
    );

    if (existingTeaser) {
      if (resolvedUserId) {
        await ctx.runMutation(internal.storyGeneration.linkTeaserToUser, {
          email: args.email,
          userId: resolvedUserId,
        });
      }
      const shouldQueueImage =
        !!args.mascotStorageId &&
        (existingTeaser.teaserImageStatus === null || existingTeaser.teaserImageStatus === "failed");

      if (shouldQueueImage) {
        await ctx.runMutation(internal.storyGeneration.updateOnboardingTeaser, {
          teaserId: existingTeaser._id,
          mascotStorageId: args.mascotStorageId,
          teaserImageStatus: "queued",
        });

        await ctx.scheduler.runAfter(0, internal.storyGenerationActions.generateOnboardingTeaserImage, {
          teaserId: existingTeaser._id,
        });
      } else if (args.mascotStorageId && !existingTeaser.mascotStorageId) {
        await ctx.runMutation(internal.storyGeneration.updateOnboardingTeaser, {
          teaserId: existingTeaser._id,
          mascotStorageId: args.mascotStorageId,
        });
      }

      return {
        success: true,
        teaserId: existingTeaser._id,
        teaser: {
          title: existingTeaser.title,
          teaserText: existingTeaser.teaserText,
        },
      };
    }

    const openRouterApiKey = getTextApiKey();
    if (!openRouterApiKey) {
      return { success: false, error: "API not configured" };
    }

    const mascotName = args.mascotName?.trim() || "the mascot";

    const teaserPrompt = `You are a beloved children's book author. Create a SHORT story teaser about a mascot hero.

STORY INSPIRATION: "${args.prompt}"
MASCOT HERO: ${mascotName} (the main character; mascots can be any type of character, like a dragon, unicorn, or robot)

CREATE A STORY ABOUT: ${mascotName}'s adventure inspired by the input above
TONE: Warm, soothing, and magical

TASK: Generate:
1. A captivating story title (5-8 words) - may include ${mascotName}'s name
2. A short book description/summary (1-2 sentences for the book cover)
3. The first page text (2-3 sentences that hook the reader and introduce ${mascotName})

REQUIREMENTS:
- ${mascotName} is the sole hero of the story
- Do NOT introduce a human child or child companion
- Keep the focus entirely on ${mascotName}'s adventure
- The teaser should make the reader EXCITED to hear the rest of the story!
- The description is a brief summary shown on the book cover in the library

RESPOND IN THIS EXACT JSON FORMAT:
{
  "title": "An Engaging Story Title",
  "description": "A brief 1-2 sentence summary of what the story is about.",
  "teaserText": "First page of the story that introduces ${mascotName} and hints at the adventure..."
}`;

    try {
      const content = await generateTextContent(openRouterApiKey, {
        messages: [
          {
            role: "system",
            content: "You are a beloved children's book author. Always respond with valid JSON only.",
          },
          { role: "user", content: teaserPrompt },
        ],
        title: "Storytime Onboarding",
      });

      let teaser: { title: string; description: string; teaserText: string };
      try {
        teaser = parseJsonFromContent<{ title: string; description: string; teaserText: string }>(
          content,
          /\{[\s\S]*?"title"[\s\S]*?"description"[\s\S]*?"teaserText"[\s\S]*?\}/
        );
      } catch {
        console.error("Teaser generation - Failed to parse JSON from content:", content);
        return { success: false, error: "Failed to parse teaser" };
      }

      // Save teaser to database
      const teaserId = await ctx.runMutation(internal.storyGeneration.saveOnboardingTeaser, {
        email: args.email,
        userId: resolvedUserId,
        prompt: args.prompt,
        childName: args.childName,
        childAge: args.childAge,
        gender: args.gender,
        title: teaser.title,
        description: teaser.description,
        teaserText: teaser.teaserText,
        mascotStorageId: args.mascotStorageId,
      });

      if (args.mascotStorageId) {
        await ctx.runMutation(internal.storyGeneration.updateOnboardingTeaser, {
          teaserId,
          teaserImageStatus: "queued",
        });

        await ctx.scheduler.runAfter(0, internal.storyGenerationActions.generateOnboardingTeaserImage, {
          teaserId,
        });
      }

      return {
        success: true,
        teaserId,
        teaser: {
          title: teaser.title,
          teaserText: teaser.teaserText,
        },
      };
    } catch (error) {
      console.error("Teaser generation failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Generate remaining pages for a teaser book (2 more pages for a 3-page story).
 * Called when user opens a teaser book for the first time.
 */
export const generateTeaserBookPages = internalAction({
  args: { bookId: v.id("books") },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    // Get book details
    const book = await ctx.runQuery(internal.storyGeneration.getTeaserBookForGeneration, {
      bookId: args.bookId,
    });

    if (!book) {
      return { success: false, error: "Book not found or not a teaser book" };
    }

    // Mark as generating
    await ctx.runMutation(internal.storyGeneration.updateTeaserBookStatus, {
      bookId: args.bookId,
      status: "generating",
    });

    const openRouterApiKey = getTextApiKey();
    if (!openRouterApiKey) {
      await ctx.runMutation(internal.storyGeneration.updateTeaserBookStatus, {
        bookId: args.bookId,
        status: "pending",
      });
      return { success: false, error: "API not configured" };
    }

    // Get onboarding data for mascot name
    const childContext = await ctx.runQuery(internal.storyGeneration.getChildContext, {
      userId: book.userId,
    });
    const mascotName = childContext?.mascotName || "the mascot";

    const prompt = `You are a beloved children's book author. Continue a SHORT story for a young child.

STORY SO FAR:
Title: "${book.title}"
Page 1: "${book.firstPageText}"

STORY INSPIRATION: "${book.teaserPrompt}"
MASCOT HERO: ${mascotName} (the main character)
CHILD: ${book.childName}, age ${book.childAge}

TASK: Generate exactly 2 more pages to complete this 3-page story. Each page should be 2-3 sentences.
- Page 2: The adventure/challenge ${mascotName} faces
- Page 3: A happy, heartwarming conclusion

REQUIREMENTS:
- Keep it very short and simple for young children
- ${mascotName} is the sole hero
- Warm, soothing, magical tone
- End on a positive, cozy note

RESPOND IN THIS EXACT JSON FORMAT:
{
  "pages": [
    { "pageIndex": 1, "text": "Page 2 text here...", "imagePrompt": "A brief description for illustration" },
    { "pageIndex": 2, "text": "Page 3 text here...", "imagePrompt": "A brief description for illustration" }
  ]
}`;

    try {
      const content = await generateTextContent(openRouterApiKey, {
        messages: [
          {
            role: "system",
            content: "You are a beloved children's book author. Always respond with valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        title: "Teaser Book Completion",
      });

      let result: { pages: Array<{ pageIndex: number; text: string; imagePrompt: string }> };
      try {
        result = parseJsonFromContent<{ pages: Array<{ pageIndex: number; text: string; imagePrompt: string }> }>(
          content,
          /\{[\s\S]*?"pages"[\s\S]*?\}/
        );
      } catch {
        console.error("Teaser book completion - Failed to parse JSON:", content);
        await ctx.runMutation(internal.storyGeneration.updateTeaserBookStatus, {
          bookId: args.bookId,
          status: "pending",
        });
        return { success: false, error: "Failed to parse story content" };
      }

      // Add pages to the book
      for (const page of result.pages) {
        await ctx.runMutation(internal.storyGeneration.addTeaserBookPage, {
          bookId: args.bookId,
          pageIndex: page.pageIndex,
          text: page.text,
          imagePrompt: page.imagePrompt,
        });
      }

      // Generate images for pages 2 and 3
      const imageApiKey = getImageApiKey();
      if (imageApiKey && book.mascotStorageId) {
        for (const page of result.pages) {
          try {
            const mascotUrl = await ctx.storage.getUrl(book.mascotStorageId);
            if (mascotUrl) {
              const imageUrl = await generateImageUrl(imageApiKey, {
                positivePrompt: `Children's book illustration: ${page.imagePrompt}. Style: Warm, magical, colorful, child-friendly, storybook art.`,
                negativePrompt: CHILD_SAFE_NEGATIVE_PROMPT,
                width: 1024,
                height: 1024,
                referenceImages: [mascotUrl],
              });

              if (imageUrl) {
                const imageResponse = await fetch(imageUrl);
                const imageBlob = await imageResponse.blob();
                const storageId = await ctx.storage.store(imageBlob);

                // Update the page with the image
                const existingPage = await ctx.runQuery(internal.storyGeneration.getBookPageByIndex, {
                  bookId: args.bookId,
                  pageIndex: page.pageIndex,
                });
                if (existingPage) {
                  await ctx.runMutation(internal.storyGeneration.updateBookPageImage, {
                    pageId: existingPage._id,
                    imageStorageId: storageId,
                  });
                }
              }
            }
          } catch (imageError) {
            console.warn(`Failed to generate image for page ${page.pageIndex}:`, imageError);
            // Continue without image - not a fatal error
          }
        }
      }

      // Mark as complete
      await ctx.runMutation(internal.storyGeneration.updateTeaserBookStatus, {
        bookId: args.bookId,
        status: "complete",
      });

      // Mark teaser as fully generated
      await ctx.runMutation(internal.storyGeneration.markTeaserFullStoryGenerated, {
        teaserId: book.teaserId,
      });

      return { success: true };
    } catch (error) {
      console.error("Teaser book page generation failed:", error);
      await ctx.runMutation(internal.storyGeneration.updateTeaserBookStatus, {
        bookId: args.bookId,
        status: "pending",
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Public action to trigger teaser book page generation
 */
export const triggerTeaserBookGeneration = action({
  args: { bookId: v.id("books") },
  returns: v.object({
    success: v.boolean(),
    alreadyComplete: v.optional(v.boolean()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args): Promise<{ success: boolean; alreadyComplete?: boolean; error?: string }> => {
    // Check book status
    const book = await ctx.runQuery(internal.storyGeneration.getTeaserBookForGeneration, {
      bookId: args.bookId,
    });

    if (!book) {
      return { success: false, error: "Book not found or not a teaser book" };
    }

    // Get full book to check status
    const fullBook = await ctx.runQuery(api.storyGeneration.getBookDetails, { bookId: args.bookId });
    if (!fullBook) {
      return { success: false, error: "Book not found" };
    }

    // Check if already complete or generating
    if (fullBook.teaserBookStatus === "complete") {
      return { success: true, alreadyComplete: true };
    }

    if (fullBook.teaserBookStatus === "generating") {
      return { success: true }; // Already in progress
    }

    // Schedule generation
    await ctx.scheduler.runAfter(0, internal.storyGenerationActions.generateTeaserBookPages, {
      bookId: args.bookId,
    });

    return { success: true };
  },
});
