"use node";

import { v } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { getAuthEmailForAction } from "./actionAuthHelpers";

const RUNWARE_API_URL = "https://api.runware.ai/v1";
const FLUX_KONTEXT_MODEL = "runware:106@1";

// Child-safety negative prompt to prevent inappropriate imagery
const CHILD_SAFE_NEGATIVE_PROMPT = "scary, frightening, dark shadows, violent, blood, weapons, horror, monsters with sharp teeth, dangerous, inappropriate, adult content, realistic human faces, photorealistic, grotesque, creepy, nightmare, death, gore, ugly, deformed, bad anatomy, extra limbs";

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
  childName: string,
  extraCharacterName?: string,
  locationName?: string
): string {
  const pageCount = PAGE_COUNTS[storyLength];
  const moralInfo = MORAL_DESCRIPTIONS[moral] || { name: moral, description: "" };

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
- Hero of the story: ${childName} (the reader's own name - make them feel special!)
${extraCharacterName ? `- Loyal companion: ${extraCharacterName} (a supportive friend who helps along the journey)` : ""}
${locationName ? `- Magical setting: ${locationName}` : ""}
- Core value to teach: ${moralInfo.name} - ${moralInfo.description}
- Emotional tone: ${vibeDescriptions[storyVibe]}

GUIDING PRINCIPLES:
1. The moral lesson must emerge NATURALLY through the story's events, never feel preachy or forced
2. ${childName} should face a relatable challenge and grow through their choices
3. Show, don't tell - let actions and consequences teach the lesson
4. Create moments of wonder, warmth, and gentle humor
5. End with a satisfying resolution that reinforces the positive value

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
  childContext: { childName: string; childAge: string; gender: string } | null
): string {
  const pageCount = PAGE_COUNTS[job.storyLength];
  const moralInfo = MORAL_DESCRIPTIONS[job.moral] || { name: job.moral, description: "" };

  const childName = childContext?.childName || "the child";
  const childAge = childContext?.childAge || "5";
  const gender = childContext?.gender || "child";
  const pronoun = gender === "boy" ? "he" : gender === "girl" ? "she" : "they";
  const possessive = gender === "boy" ? "his" : gender === "girl" ? "her" : "their";

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
    situation: `Create a therapeutic story that helps ${childName} process and cope with: "${job.prompt}"`,
    auto: `Create a heartwarming story that celebrates childhood wonder and curiosity.`,
  };

  // Comprehensive therapeutic guidelines for situation mode
  const therapeuticGuidelines = job.mode === 'situation' ? `
═══════════════════════════════════════
      THERAPEUTIC STORY APPROACH
═══════════════════════════════════════

A parent has shared this real-life challenge: "${job.prompt}"

YOUR MISSION: Create a story that helps ${childName} process this experience safely and learn from it positively.

📋 SITUATION ANALYSIS:
First, identify what the child is experiencing:
- What is the CORE EMOTION? (fear, anger, sadness, anxiety, jealousy, confusion, embarrassment)
- What NEED might be unmet? (safety, belonging, control, understanding, comfort, validation)
- What SKILL could help? (communication, self-regulation, empathy, bravery, acceptance, problem-solving)

🛡️ THERAPEUTIC STORYTELLING PRINCIPLES:
1. VALIDATE ${childName}'s feelings - feelings are NEVER wrong, even if the behavior was
2. NORMALIZE the experience - "many children feel this way, it's okay"
3. REFRAME the challenge - from scary/bad to something they can grow through
4. MODEL healthy responses - show ${childName} using age-appropriate coping strategies
5. EMPOWER with agency - ${childName} can make positive choices going forward
6. ENSURE HOPE - the story ends with connection, understanding, and a path forward

⚠️ CRITICAL SAFETY RULES FOR SENSITIVE TOPICS:
- NEVER blame or shame ${childName} for the situation or ${possessive} feelings
- NEVER make "wrong" behavior seem exciting, fun, or rewarded in the story
- NEVER dismiss, minimize, or mock the child's emotions
- NEVER include scary consequences or punishments
- ALWAYS show caring adults who are helpful, patient, and understanding
- ALWAYS end with reconciliation, hope, and ${childName} feeling loved
- If the topic involves conflict, focus on REPAIR and UNDERSTANDING, not who was "right"

🎯 STORY STRUCTURE FOR REAL-LIFE SITUATIONS:
Page 1: Establish ${childName}'s world and show ${pronoun} is loved
Page 2: The challenge appears (mirror the real situation through metaphor or directly)
Page 3: ${childName} feels the difficult emotions - VALIDATE these fully
Page 4: A caring figure (friend, parent, or wise character) offers gentle support
Page 5+: ${childName} discovers a way forward, makes a positive choice
Final Page: Resolution, reconnection with loved ones, and ${childName} feeling capable and loved

💡 METAPHOR GUIDANCE FOR COMMON SITUATIONS:
- Conflict/fight → Focus on how words can hurt AND heal, show repair and forgiveness
- Doctor/dentist visit → The helper is friendly, the experience is manageable, bravery is rewarded
- New sibling → Hearts grow bigger, there's enough love for everyone
- Fear (dark, monsters) → Fears become friends, ${childName} finds inner courage
- Loss/grief → Loved ones live on in memories and hearts, it's okay to feel sad
- Starting school → New places become familiar, new friends are waiting to be found
- Sharing difficulties → Joy multiplies when shared, taking turns feels good
- Big emotions/tantrums → Feelings are like weather, they pass, and ${childName} learns to cope
` : '';

  const locationContext = job.locationName
    ? `The adventure unfolds in ${job.locationName} - bring this setting to vivid life with sensory details.`
    : job.mode === 'situation'
      ? "Choose a setting that is safe, familiar, and comforting to young children."
      : "Choose a setting that feels magical yet relatable to young children.";

  const companionContext = job.extraCharacterName
    ? `${childName}'s loyal friend ${job.extraCharacterName} joins the adventure. This companion should:
  - Provide emotional support and encouragement
  - Sometimes need help too (showing that helping others feels good)
  - Celebrate ${childName}'s victories genuinely`
    : "";

  return `You are an acclaimed children's picture book author whose stories are treasured by families worldwide. Your gift is creating tales that children BEG to hear again and again - stories that make them feel brave, loved, and capable.

${modeInstructions[job.mode]}
${therapeuticGuidelines}
═══════════════════════════════════════
          THE HEART OF THE STORY
═══════════════════════════════════════

HERO: ${childName}, ${childAge} years old (${gender})
This is the reader's story - ${childName} IS the child listening. Make ${pronoun} feel heroic, capable, and deeply loved.

${companionContext}

${locationContext}

CORE VALUE: ${moralInfo.name}
${moralInfo.description}

═══════════════════════════════════════
          STORYTELLING PRINCIPLES
═══════════════════════════════════════

🌟 MORAL TEACHING (CRITICAL):
- The lesson must emerge through STORY EVENTS, not lectures
- Show ${childName} making a CHOICE that reflects the value
- Include a NATURAL CONSEQUENCE that reinforces why this value matters
- The child should FEEL the truth of the lesson, not just hear it
- Example: Don't say "Sharing is good." Instead, show ${childName} sharing ${possessive} last cookie, seeing a friend's face light up, and feeling warm inside.

🎭 EMOTIONAL JOURNEY:
- Page 1-2: Establish ${childName}'s world, then introduce a challenge or desire
- Middle pages: Build tension through obstacles, show growth through small choices
- Final pages: Satisfying resolution where the moral naturally shines through

✨ CREATIVE ELEMENTS:
- Sensory details: What does ${childName} see, hear, feel, smell?
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
          IMAGE PROMPTS
═══════════════════════════════════════

For each page, create a detailed illustration prompt that includes:
- Characters present and their expressions/emotions
- Setting details and atmosphere
- Action or moment captured
- Color palette and lighting mood
- Style: "Children's picture book illustration, soft watercolor style, warm and inviting"

RESPOND IN THIS EXACT JSON FORMAT:
{
  "title": "An engaging, memorable title",
  "description": "A one-sentence summary that captures the story's heart",
  "moralDescription": "What children will learn and feel from this story",
  "pages": [
    {
      "pageIndex": 0,
      "text": "Story text for this page...",
      "imagePrompt": "Detailed illustration prompt...",
      "hasMascot": true,
      "hasExtraCharacter": false
    }
  ]
}`;
}

function buildImagePrompt(
  basePrompt: string,
  hasMascot: boolean,
  mascotUrl: string | null,
  storyVibe?: string
): string {
  // Vibe-specific style enhancements for visual consistency
  const vibeStyles: Record<string, string> = {
    energizing: "vibrant colors, dynamic composition, sense of adventure and excitement, bright sunshine",
    soothing: "soft pastel colors, gentle diffused light, dreamy calm atmosphere, cozy feeling",
    whimsical: "magical sparkles, fantastical elements, playful bright colors, enchanted feeling",
    thoughtful: "warm earth tones, cozy golden hour lighting, emotional depth, gentle mood",
  };

  const vibeStyle = storyVibe && vibeStyles[storyVibe] ? vibeStyles[storyVibe] : "warm inviting colors";

  const styleGuide = `Children's picture book illustration, soft watercolor style, ${vibeStyle}, rounded friendly shapes, expressive cartoon eyes, warm and inviting atmosphere, child-safe wholesome content suitable for ages 2-8, high quality detailed background, professional illustration, no text or words in image.`;

  const mascotInstruction = hasMascot && mascotUrl
    ? "The main character from the reference image should be prominently featured, maintaining their exact appearance and clothing."
    : "";

  return `${basePrompt}. ${mascotInstruction} ${styleGuide}`.replace(/\s+/g, " ").trim();
}

interface RunwareImageResponse {
  data: Array<{
    taskType: string;
    imageUUID: string;
    taskUUID: string;
    imageURL: string;
  }>;
}

async function generatePageImage(
  apiKey: string,
  prompt: string,
  referenceImages: string[]
): Promise<{ imageUrl: string | null }> {
  try {
    const requestBody: Record<string, unknown> = {
      taskType: "imageInference",
      taskUUID: crypto.randomUUID(),
      model: referenceImages.length > 0 ? FLUX_KONTEXT_MODEL : "runware:101@1",
      positivePrompt: prompt,
      negativePrompt: CHILD_SAFE_NEGATIVE_PROMPT,
      width: 1024,
      height: 1024,
      steps: 25,
      CFGScale: 7.5,
      numberResults: 1,
    };

    if (referenceImages.length > 0) {
      requestBody.referenceImages = referenceImages;
    }

    const response = await fetch(RUNWARE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify([requestBody]),
    });

    if (!response.ok) {
      console.error("Runware API error:", await response.text());
      return { imageUrl: null };
    }

    const result = (await response.json()) as RunwareImageResponse;

    if (result.data && result.data.length > 0) {
      return { imageUrl: result.data[0].imageURL };
    }

    return { imageUrl: null };
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

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
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

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterApiKey}`,
          "HTTP-Referer": "https://storytime.app",
          "X-Title": "Storytime",
        },
        body: JSON.stringify({
          model: "moonshotai/kimi-k2-thinking",
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
          response_format: { type: "json_object" },
          temperature: 0.85,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${errorText}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content in OpenRouter response");
      }

      let story: GeneratedStory;
      try {
        story = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          story = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Failed to parse story JSON");
        }
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

      const runwareApiKey = process.env.RUNWARE_API_KEY;
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
    const email = await getAuthEmailForAction(ctx);
    if (!email) {
      return { success: false, error: "Not authenticated" };
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return { success: false, error: "API not configured" };
    }

    const childContext = await ctx.runQuery(internal.storyGeneration.getChildContextByEmail, {
      email,
    });

    const childName = childContext?.childName || "the child";
    const moral = args.moral || "empathy";

    const prompt = buildOutlinePrompt(
      args.mode as StoryMode,
      args.prompt,
      moral,
      args.storyLength as StoryLength,
      args.storyVibe as StoryVibe,
      childName,
      args.extraCharacterName,
      args.locationName
    );

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterApiKey}`,
          "HTTP-Referer": "https://storytime.app",
          "X-Title": "Storytime",
        },
        body: JSON.stringify({
          model: "moonshotai/kimi-k2-thinking",
          messages: [
            {
              role: "system",
              content: "You are an award-winning children's book author. Always respond with valid JSON only, no additional text or markdown.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.85,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `API error: ${errorText}` };
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;

      if (!content) {
        return { success: false, error: "No content in response" };
      }

      let outline: GeneratedOutline;
      try {
        outline = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          outline = JSON.parse(jsonMatch[0]);
        } else {
          return { success: false, error: "Failed to parse outline" };
        }
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
 * Only generates title + first page text (no images)
 */
export const generateOnboardingTeaser = action({
  args: {
    prompt: v.string(),
    childName: v.string(),
    childAge: v.string(),
    gender: v.string(),
    email: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    teaser: v.optional(
      v.object({
        title: v.string(),
        teaserText: v.string(),
      })
    ),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return { success: false, error: "API not configured" };
    }

    const pronoun = args.gender === "boy" ? "he" : args.gender === "girl" ? "she" : "they";

    const teaserPrompt = `You are a beloved children's book author. Create a SHORT story teaser for a child.

CHILD'S INPUT: "${args.prompt}"
CHILD'S NAME: ${args.childName} (${args.childAge} years old, ${args.gender})

CREATE A STORY ABOUT: Friendship and connection
TONE: Warm, soothing, and magical

TASK: Generate ONLY:
1. A captivating story title (5-8 words)
2. The first page text (2-3 sentences that hook the reader)

The story should feature ${args.childName} as the main character. Make ${pronoun} feel special and loved.
The teaser should make the child EXCITED to hear the rest of the story!

RESPOND IN THIS EXACT JSON FORMAT:
{
  "title": "An Engaging Story Title",
  "teaserText": "First page of the story that introduces ${args.childName} and hints at the adventure..."
}`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterApiKey}`,
          "HTTP-Referer": "https://storytime.app",
          "X-Title": "Storytime Onboarding",
        },
        body: JSON.stringify({
          model: "moonshotai/kimi-k2-thinking",
          messages: [
            {
              role: "system",
              content: "You are a beloved children's book author. Always respond with valid JSON only.",
            },
            { role: "user", content: teaserPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `API error: ${errorText}` };
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;

      if (!content) {
        return { success: false, error: "No content in response" };
      }

      let teaser: { title: string; teaserText: string };
      try {
        teaser = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          teaser = JSON.parse(jsonMatch[0]);
        } else {
          return { success: false, error: "Failed to parse teaser" };
        }
      }

      // Save teaser to database
      await ctx.runMutation(internal.storyGeneration.saveOnboardingTeaser, {
        email: args.email,
        prompt: args.prompt,
        childName: args.childName,
        childAge: args.childAge,
        gender: args.gender,
        title: teaser.title,
        teaserText: teaser.teaserText,
      });

      return {
        success: true,
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
