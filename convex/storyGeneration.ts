import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { getAuthUser, requireAuthUser } from "./authHelpers";

const SKILL_KEYS = [
  "empathy",
  "bravery",
  "honesty",
  "teamwork",
  "creativity",
  "gratitude",
  "problemSolving",
  "responsibility",
  "patience",
  "curiosity",
] as const;

const DURATION_MINUTES: Record<string, number> = {
  short: 3,
  medium: 5,
  long: 8,
};

type StoryLength = "short" | "medium" | "long";
type StoryVibe = "energizing" | "soothing" | "whimsical" | "thoughtful";
type VocabularyLevel = "beginner" | "intermediate" | "advanced";

export const findLowestStat = internalQuery({
  args: { userId: v.id("users") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const skills = await ctx.db
      .query("userSkills")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!skills) return null;

    let lowestSkill = "empathy";
    let lowestProgress = 100;

    for (const key of SKILL_KEYS) {
      const skill = skills[key];
      if (skill && skill.progress < lowestProgress) {
        lowestProgress = skill.progress;
        lowestSkill = key;
      }
    }

    return lowestSkill;
  },
});

export const getChildContext = internalQuery({
  args: { userId: v.id("users") },
  returns: v.union(
    v.object({
      childName: v.string(),
      childAge: v.string(),
      gender: v.string(),
      mascotStorageId: v.union(v.id("_storage"), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!onboarding) return null;

    const outfit = await ctx.db
      .query("mascotOutfit")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    const mascotStorageId = outfit?.currentMascotId ?? onboarding.generatedMascotId ?? null;

    return {
      childName: onboarding.childName,
      childAge: onboarding.childAge,
      gender: onboarding.gender,
      mascotStorageId,
    };
  },
});

export const getChildContextByEmail = internalQuery({
  args: { email: v.string() },
  returns: v.union(
    v.object({
      childName: v.string(),
      childAge: v.string(),
      gender: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) return null;

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!onboarding) return null;

    return {
      childName: onboarding.childName,
      childAge: onboarding.childAge,
      gender: onboarding.gender,
    };
  },
});

export const queueStoryJob = mutation({
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
    vocabularyLevel: v.optional(
      v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced"))
    ),
    moral: v.optional(v.string()),
    extraCharacterId: v.optional(v.string()),
    extraCharacterName: v.optional(v.string()),
    locationId: v.optional(v.string()),
    locationName: v.optional(v.string()),
    voiceId: v.optional(v.string()),
    creditCost: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    jobId: v.optional(v.id("storyJobs")),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const credits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!credits || credits.balance < args.creditCost) {
      return { success: false, error: "Insufficient credits" };
    }

    await ctx.db.patch(credits._id, {
      balance: credits.balance - args.creditCost,
    });

    const childContext = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    const outfit = await ctx.db
      .query("mascotOutfit")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    const mascotStorageId = outfit?.currentMascotId ?? childContext?.generatedMascotId;

    let moral = args.moral || "";
    let moralAutoSelected = false;

    if (!moral || args.mode === "auto") {
      const skills = await ctx.db
        .query("userSkills")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();

      if (skills) {
        let lowestSkill = "empathy";
        let lowestProgress = 100;

        for (const key of SKILL_KEYS) {
          const skill = skills[key];
          if (skill && skill.progress < lowestProgress) {
            lowestProgress = skill.progress;
            lowestSkill = key;
          }
        }
        moral = lowestSkill;
        moralAutoSelected = true;
      } else {
        moral = "empathy";
        moralAutoSelected = true;
      }
    }

    let vocabularyLevel: VocabularyLevel = args.vocabularyLevel || "beginner";
    if (!args.vocabularyLevel && childContext) {
      const age = parseInt(childContext.childAge);
      if (age <= 4) vocabularyLevel = "beginner";
      else if (age <= 6) vocabularyLevel = "intermediate";
      else vocabularyLevel = "advanced";
    }

    const jobId = await ctx.db.insert("storyJobs", {
      userId: user._id,
      status: "queued",
      progress: 0,
      reservedCredits: args.creditCost,
      mode: args.mode,
      prompt: args.prompt || "a magical adventure",
      storyLength: args.storyLength,
      storyVibe: args.storyVibe,
      vocabularyLevel,
      moral,
      moralAutoSelected,
      mascotStorageId,
      extraCharacterId: args.extraCharacterId,
      extraCharacterName: args.extraCharacterName,
      locationId: args.locationId,
      locationName: args.locationName,
      voiceId: args.voiceId,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.storyGenerationActions.generateStory, { jobId });

    return { success: true, jobId };
  },
});

export const updateJobProgress = internalMutation({
  args: {
    jobId: v.id("storyJobs"),
    status: v.optional(
      v.union(
        v.literal("queued"),
        v.literal("generating_story"),
        v.literal("generating_images"),
        v.literal("complete"),
        v.literal("failed"),
        v.literal("canceled")
      )
    ),
    progress: v.optional(v.number()),
    error: v.optional(v.string()),
    bookId: v.optional(v.id("books")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {};
    if (args.status !== undefined) updates.status = args.status;
    if (args.progress !== undefined) updates.progress = args.progress;
    if (args.error !== undefined) updates.error = args.error;
    if (args.bookId !== undefined) updates.bookId = args.bookId;

    if (args.status === "generating_story" || args.status === "generating_images") {
      updates.startedAt = Date.now();
    }
    if (args.status === "complete" || args.status === "failed") {
      updates.finishedAt = Date.now();
    }

    await ctx.db.patch(args.jobId, updates);
    return null;
  },
});

export const createBook = internalMutation({
  args: {
    jobId: v.id("storyJobs"),
    title: v.string(),
    description: v.string(),
    moral: v.string(),
    moralDescription: v.string(),
    pageCount: v.number(),
    storyLength: v.union(v.literal("short"), v.literal("medium"), v.literal("long")),
    vocabularyLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    storyVibe: v.union(
      v.literal("energizing"),
      v.literal("soothing"),
      v.literal("whimsical"),
      v.literal("thoughtful")
    ),
    durationMinutes: v.number(),
  },
  returns: v.id("books"),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    const bookId = await ctx.db.insert("books", {
      userId: job.userId,
      jobId: args.jobId,
      title: args.title,
      description: args.description,
      moral: args.moral,
      moralDescription: args.moralDescription,
      pageCount: args.pageCount,
      storyLength: args.storyLength,
      vocabularyLevel: args.vocabularyLevel,
      storyVibe: args.storyVibe,
      readingProgress: 0,
      lastReadPageIndex: 0,
      durationMinutes: args.durationMinutes,
      createdAt: Date.now(),
    });

    return bookId;
  },
});

export const createBookPage = internalMutation({
  args: {
    bookId: v.id("books"),
    jobId: v.id("storyJobs"),
    pageIndex: v.number(),
    text: v.string(),
    imagePrompt: v.string(),
    hasMascot: v.boolean(),
    hasExtraCharacter: v.boolean(),
  },
  returns: v.id("bookPages"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookPages", {
      bookId: args.bookId,
      jobId: args.jobId,
      pageIndex: args.pageIndex,
      text: args.text,
      imagePrompt: args.imagePrompt,
      hasMascot: args.hasMascot,
      hasExtraCharacter: args.hasExtraCharacter,
    });
  },
});

export const updatePageImage = internalMutation({
  args: {
    pageId: v.id("bookPages"),
    imageStorageId: v.id("_storage"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.pageId, { imageStorageId: args.imageStorageId });
    return null;
  },
});

export const updateBookCover = internalMutation({
  args: {
    bookId: v.id("books"),
    coverImageStorageId: v.id("_storage"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookId, { coverImageStorageId: args.coverImageStorageId });
    return null;
  },
});

export const getJob = internalQuery({
  args: { jobId: v.id("storyJobs") },
  returns: v.union(
    v.object({
      _id: v.id("storyJobs"),
      userId: v.id("users"),
      status: v.string(),
      progress: v.number(),
      mode: v.string(),
      prompt: v.string(),
      storyLength: v.string(),
      storyVibe: v.string(),
      vocabularyLevel: v.string(),
      moral: v.string(),
      mascotStorageId: v.optional(v.id("_storage")),
      extraCharacterId: v.optional(v.string()),
      extraCharacterName: v.optional(v.string()),
      locationId: v.optional(v.string()),
      locationName: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) return null;

    return {
      _id: job._id,
      userId: job.userId,
      status: job.status,
      progress: job.progress,
      mode: job.mode,
      prompt: job.prompt,
      storyLength: job.storyLength,
      storyVibe: job.storyVibe,
      vocabularyLevel: job.vocabularyLevel,
      moral: job.moral,
      mascotStorageId: job.mascotStorageId,
      extraCharacterId: job.extraCharacterId,
      extraCharacterName: job.extraCharacterName,
      locationId: job.locationId,
      locationName: job.locationName,
    };
  },
});

export const getStoryJob = query({
  args: { jobId: v.id("storyJobs") },
  returns: v.union(
    v.object({
      _id: v.id("storyJobs"),
      status: v.string(),
      progress: v.number(),
      error: v.optional(v.string()),
      bookId: v.optional(v.id("books")),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    const job = await ctx.db.get(args.jobId);
    if (!job) return null;

    // Verify ownership - users can only access their own jobs
    if (job.userId !== user._id) return null;

    return {
      _id: job._id,
      status: job.status,
      progress: job.progress,
      error: job.error,
      bookId: job.bookId,
    };
  },
});

export const getUserBooks = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id("books"),
      title: v.string(),
      description: v.string(),
      moral: v.string(),
      pageCount: v.number(),
      readingProgress: v.number(),
      durationMinutes: v.number(),
      coverImageUrl: v.union(v.string(), v.null()),
      createdAt: v.number(),
      storyVibe: v.string(),
      vocabularyLevel: v.string(),
      userRating: v.union(v.literal("up"), v.literal("down"), v.null()),
    })
  ),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) return [];

    const limit = args.limit ?? 50;
    const books = await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    const result = [];
    for (const book of books) {
      let coverImageUrl: string | null = null;
      if (book.coverImageStorageId) {
        coverImageUrl = await ctx.storage.getUrl(book.coverImageStorageId);
      }

      result.push({
        _id: book._id,
        title: book.title,
        description: book.description,
        moral: book.moral,
        pageCount: book.pageCount,
        readingProgress: book.readingProgress,
        durationMinutes: book.durationMinutes,
        coverImageUrl,
        createdAt: book.createdAt,
        storyVibe: book.storyVibe,
        vocabularyLevel: book.vocabularyLevel,
        userRating: book.userRating ?? null,
      });
    }

    return result;
  },
});

export const getBookPage = query({
  args: { bookId: v.id("books"), pageIndex: v.number() },
  returns: v.union(
    v.object({
      _id: v.id("bookPages"),
      pageIndex: v.number(),
      text: v.string(),
      imageUrl: v.union(v.string(), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    const book = await ctx.db.get(args.bookId);
    if (!book || book.userId !== user._id) return null;

    const page = await ctx.db
      .query("bookPages")
      .withIndex("by_book_and_page", (q) =>
        q.eq("bookId", args.bookId).eq("pageIndex", args.pageIndex)
      )
      .unique();

    if (!page) return null;

    let imageUrl: string | null = null;
    if (page.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(page.imageStorageId);
    }

    return {
      _id: page._id,
      pageIndex: page.pageIndex,
      text: page.text,
      imageUrl,
    };
  },
});

export const getBookPages = query({
  args: { bookId: v.id("books") },
  returns: v.array(
    v.object({
      _id: v.id("bookPages"),
      pageIndex: v.number(),
      text: v.string(),
      imageUrl: v.union(v.string(), v.null()),
      hasMascot: v.boolean(),
      hasExtraCharacter: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) return [];

    // Verify book belongs to authenticated user
    const book = await ctx.db.get(args.bookId);
    if (!book || book.userId !== user._id) return [];

    const pages = await ctx.db
      .query("bookPages")
      .withIndex("by_book", (q) => q.eq("bookId", args.bookId))
      .collect();

    pages.sort((a, b) => a.pageIndex - b.pageIndex);

    const result = [];
    for (const page of pages) {
      let imageUrl: string | null = null;
      if (page.imageStorageId) {
        imageUrl = await ctx.storage.getUrl(page.imageStorageId);
      }

      result.push({
        _id: page._id,
        pageIndex: page.pageIndex,
        text: page.text,
        imageUrl,
        hasMascot: page.hasMascot,
        hasExtraCharacter: page.hasExtraCharacter,
      });
    }

    return result;
  },
});

export const cancelStoryJob = mutation({
  args: { jobId: v.id("storyJobs") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) return { success: false };

    const job = await ctx.db.get(args.jobId);
    if (!job) return { success: false };

    if (job.status === "queued" || job.status === "generating_story") {
      await ctx.db.patch(args.jobId, {
        status: "canceled",
        finishedAt: Date.now(),
      });

      const credits = await ctx.db
        .query("userCredits")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();
      if (credits) {
        await ctx.db.patch(credits._id, {
          balance: credits.balance + job.reservedCredits,
        });
      }

      return { success: true };
    }

    return { success: false };
  },
});

export const getBook = query({
  args: { bookId: v.id("books") },
  returns: v.union(
    v.object({
      _id: v.id("books"),
      title: v.string(),
      description: v.string(),
      moral: v.string(),
      moralDescription: v.string(),
      pageCount: v.number(),
      readingProgress: v.number(),
      lastReadPageIndex: v.number(),
      durationMinutes: v.number(),
      coverImageUrl: v.union(v.string(), v.null()),
      storyVibe: v.string(),
      vocabularyLevel: v.string(),
      userRating: v.optional(v.union(v.literal("up"), v.literal("down"))),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    const book = await ctx.db.get(args.bookId);
    if (!book) return null;

    // Verify book belongs to authenticated user
    if (book.userId !== user._id) return null;

    let coverImageUrl: string | null = null;
    if (book.coverImageStorageId) {
      coverImageUrl = await ctx.storage.getUrl(book.coverImageStorageId);
    }

    return {
      _id: book._id,
      title: book.title,
      description: book.description,
      moral: book.moral,
      moralDescription: book.moralDescription,
      pageCount: book.pageCount,
      readingProgress: book.readingProgress,
      lastReadPageIndex: book.lastReadPageIndex,
      durationMinutes: book.durationMinutes,
      coverImageUrl,
      storyVibe: book.storyVibe,
      vocabularyLevel: book.vocabularyLevel,
      userRating: book.userRating,
    };
  },
});

export const updateBookProgress = mutation({
  args: {
    bookId: v.id("books"),
    readingProgress: v.number(),
    lastReadPageIndex: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    // Verify book belongs to authenticated user
    const book = await ctx.db.get(args.bookId);
    if (!book || book.userId !== user._id) return null;

    await ctx.db.patch(args.bookId, {
      readingProgress: args.readingProgress,
      lastReadPageIndex: args.lastReadPageIndex,
      lastReadAt: Date.now(),
    });
    return null;
  },
});

export const rateBook = mutation({
  args: {
    bookId: v.id("books"),
    rating: v.union(v.literal("up"), v.literal("down")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    // Verify book belongs to authenticated user
    const book = await ctx.db.get(args.bookId);
    if (!book || book.userId !== user._id) return null;

    await ctx.db.patch(args.bookId, { userRating: args.rating });
    return null;
  },
});

export const getUserActiveJobs = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("storyJobs"),
      status: v.string(),
      progress: v.number(),
      prompt: v.string(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) return [];

    const jobs = await ctx.db
      .query("storyJobs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return jobs
      .filter(j => j.status !== "complete" && j.status !== "failed" && j.status !== "canceled")
      .map(job => ({
        _id: job._id,
        status: job.status,
        progress: job.progress,
        prompt: job.prompt,
        createdAt: job.createdAt,
      }));
  },
});

// Points awarded based on story length
const POINTS_BY_LENGTH: Record<string, number> = {
  short: 3,
  medium: 5,
  long: 8,
};

/**
 * Called when a book is completed (100% read) to update the child's skill scores
 * The skill updated is based on the book's moral/value theme
 */
export const completeBookAndUpdateSkills = mutation({
  args: { bookId: v.id("books") },
  returns: v.object({
    success: v.boolean(),
    skillUpdated: v.optional(v.string()),
    pointsAdded: v.optional(v.number()),
  }),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) return { success: false };

    const book = await ctx.db.get(args.bookId);
    if (!book || book.userId !== user._id) return { success: false };

    // Check if already contributed (prevent double-counting)
    const existingContribution = await ctx.db
      .query("skillContributions")
      .withIndex("by_book", (q) => q.eq("bookId", args.bookId))
      .unique();
    if (existingContribution) {
      return { success: true, skillUpdated: existingContribution.skillKey, pointsAdded: 0 };
    }

    // Get or create user skills
    let userSkills = await ctx.db
      .query("userSkills")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!userSkills) {
      // Initialize with default skills including proper subSkill names
      const defaultSubSkills: Record<string, Array<{ name: string; value: number }>> = {
        empathy: [{ name: "Perspective", value: 20 }, { name: "Compassion", value: 20 }, { name: "Kindness", value: 20 }],
        bravery: [{ name: "Confidence", value: 20 }, { name: "Grit", value: 20 }, { name: "Risk Taking", value: 20 }],
        honesty: [{ name: "Truthfulness", value: 20 }, { name: "Trust", value: 20 }, { name: "Integrity", value: 20 }],
        teamwork: [{ name: "Cooperation", value: 20 }, { name: "Listening", value: 20 }, { name: "Support", value: 20 }],
        creativity: [{ name: "Visualization", value: 20 }, { name: "Storytelling", value: 20 }, { name: "Wonder", value: 20 }],
        gratitude: [{ name: "Thankfulness", value: 20 }, { name: "Positivity", value: 20 }, { name: "Appreciation", value: 20 }],
        problemSolving: [{ name: "Logic", value: 20 }, { name: "Strategy", value: 20 }, { name: "Analysis", value: 20 }],
        responsibility: [{ name: "Duty", value: 20 }, { name: "Reliability", value: 20 }, { name: "Ownership", value: 20 }],
        patience: [{ name: "Waiting", value: 20 }, { name: "Calmness", value: 20 }, { name: "Self-Control", value: 20 }],
        curiosity: [{ name: "Inquiry", value: 20 }, { name: "Exploration", value: 20 }, { name: "Discovery", value: 20 }],
      };
      const skillsId = await ctx.db.insert("userSkills", {
        userId: user._id,
        overallScore: 20,
        empathy: { progress: 20, subSkills: defaultSubSkills.empathy },
        bravery: { progress: 20, subSkills: defaultSubSkills.bravery },
        honesty: { progress: 20, subSkills: defaultSubSkills.honesty },
        teamwork: { progress: 20, subSkills: defaultSubSkills.teamwork },
        creativity: { progress: 20, subSkills: defaultSubSkills.creativity },
        gratitude: { progress: 20, subSkills: defaultSubSkills.gratitude },
        problemSolving: { progress: 20, subSkills: defaultSubSkills.problemSolving },
        responsibility: { progress: 20, subSkills: defaultSubSkills.responsibility },
        patience: { progress: 20, subSkills: defaultSubSkills.patience },
        curiosity: { progress: 20, subSkills: defaultSubSkills.curiosity },
      });
      userSkills = await ctx.db.get(skillsId);
    }

    if (!userSkills) return { success: false };

    // Map book moral to skill key
    const moralToSkillMap: Record<string, typeof SKILL_KEYS[number]> = {
      empathy: "empathy",
      compassion: "empathy",
      bravery: "bravery",
      courage: "bravery",
      resilience: "bravery",
      honesty: "honesty",
      truth: "honesty",
      integrity: "honesty",
      teamwork: "teamwork",
      cooperation: "teamwork",
      creativity: "creativity",
      imagination: "creativity",
      gratitude: "gratitude",
      thankfulness: "gratitude",
      problemsolving: "problemSolving",
      "problem solving": "problemSolving",
      responsibility: "responsibility",
      patience: "patience",
      curiosity: "curiosity",
    };

    const bookMoral = book.moral.toLowerCase().replace(/[^a-z\s]/g, "");
    const skillKey = moralToSkillMap[bookMoral] || "empathy";
    const pointsToAdd = POINTS_BY_LENGTH[book.storyLength] || 5;

    // Get current skill data
    const currentSkill = userSkills[skillKey as keyof typeof userSkills] as {
      progress: number;
      subSkills: Array<{ name: string; value: number }>
    };

    // Only update sub-scores (distribute points across sub-skills)
    const pointsPerSubSkill = Math.floor(pointsToAdd / Math.max(1, currentSkill?.subSkills?.length || 1));
    const updatedSubSkills = (currentSkill?.subSkills || []).map(sub => ({
      ...sub,
      value: Math.min(100, sub.value + pointsPerSubSkill),
    }));

    // Calculate main score FROM sub-scores (average of sub-skill values)
    const newMainScore = updatedSubSkills.length > 0
      ? Math.round(updatedSubSkills.reduce((sum, sub) => sum + sub.value, 0) / updatedSubSkills.length)
      : currentSkill?.progress || 0;

    // Update the skill with new sub-scores and derived main score
    await ctx.db.patch(userSkills._id, {
      [skillKey]: {
        progress: newMainScore,
        subSkills: updatedSubSkills.length > 0 ? updatedSubSkills : currentSkill?.subSkills || [],
      },
    });

    // Calculate overall score from all main scores (which are derived from sub-scores)
    let totalProgress = 0;
    for (const key of SKILL_KEYS) {
      if (key === skillKey) {
        totalProgress += newMainScore;
      } else {
        const skill = userSkills[key as keyof typeof userSkills] as { progress: number };
        totalProgress += skill?.progress || 0;
      }
    }
    const newOverallScore = Math.round(totalProgress / SKILL_KEYS.length);
    await ctx.db.patch(userSkills._id, { overallScore: newOverallScore });

    // Record the contribution
    await ctx.db.insert("skillContributions", {
      userId: user._id,
      bookId: args.bookId,
      skillKey,
      pointsAdded: pointsToAdd,
      createdAt: Date.now(),
    });

    return { success: true, skillUpdated: skillKey, pointsAdded: pointsToAdd };
  },
});

/**
 * Get all skill contributions for the current user, grouped by skill
 */
export const getSkillContributions = query({
  args: {},
  returns: v.array(
    v.object({
      skillKey: v.string(),
      contributions: v.array(
        v.object({
          bookId: v.id("books"),
          bookTitle: v.string(),
          bookCoverUrl: v.union(v.string(), v.null()),
          pointsAdded: v.number(),
          createdAt: v.number(),
        })
      ),
    })
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) return [];

    const contributions = await ctx.db
      .query("skillContributions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Group by skill
    const groupedBySkill: Record<string, Array<{
      bookId: Id<"books">;
      bookTitle: string;
      bookCoverUrl: string | null;
      pointsAdded: number;
      createdAt: number;
    }>> = {};

    for (const contrib of contributions) {
      const book = await ctx.db.get(contrib.bookId);
      if (!book) continue;

      let coverUrl: string | null = null;
      if (book.coverImageStorageId) {
        coverUrl = await ctx.storage.getUrl(book.coverImageStorageId);
      }

      if (!groupedBySkill[contrib.skillKey]) {
        groupedBySkill[contrib.skillKey] = [];
      }

      groupedBySkill[contrib.skillKey].push({
        bookId: contrib.bookId,
        bookTitle: book.title,
        bookCoverUrl: coverUrl,
        pointsAdded: contrib.pointsAdded,
        createdAt: contrib.createdAt,
      });
    }

    return Object.entries(groupedBySkill).map(([skillKey, contribs]) => ({
      skillKey,
      contributions: contribs.sort((a, b) => b.createdAt - a.createdAt),
    }));
  },
});

/**
 * Get detailed skills data for the stats page
 */
export const getDetailedSkills = query({
  args: {},
  returns: v.union(
    v.object({
      overallScore: v.number(),
      skills: v.array(
        v.object({
          key: v.string(),
          progress: v.number(),
          subSkills: v.array(v.object({ name: v.string(), value: v.number() })),
        })
      ),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    const userSkills = await ctx.db
      .query("userSkills")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!userSkills) return null;

    const skills = SKILL_KEYS.map(key => {
      const skill = userSkills[key as keyof typeof userSkills] as { progress: number; subSkills: Array<{ name: string; value: number }> };
      return {
        key,
        progress: skill?.progress || 0,
        subSkills: skill?.subSkills || [],
      };
    });

    return {
      overallScore: userSkills.overallScore,
      skills,
    };
  },
});

// ============================================
// ONBOARDING TEASER FUNCTIONS
// ============================================

/**
 * Save onboarding teaser (called from generateOnboardingTeaser action)
 */
export const saveOnboardingTeaser = internalMutation({
  args: {
    email: v.string(),
    prompt: v.string(),
    childName: v.string(),
    childAge: v.string(),
    gender: v.string(),
    title: v.string(),
    teaserText: v.string(),
  },
  returns: v.id("onboardingTeasers"),
  handler: async (ctx, args) => {
    // Check if teaser already exists for this email
    const existing = await ctx.db
      .query("onboardingTeasers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing teaser
      await ctx.db.patch(existing._id, {
        prompt: args.prompt,
        childName: args.childName,
        childAge: args.childAge,
        gender: args.gender,
        title: args.title,
        teaserText: args.teaserText,
        createdAt: Date.now(),
      });
      return existing._id;
    }

    // Create new teaser
    return await ctx.db.insert("onboardingTeasers", {
      email: args.email,
      prompt: args.prompt,
      childName: args.childName,
      childAge: args.childAge,
      gender: args.gender,
      title: args.title,
      teaserText: args.teaserText,
      fullStoryGenerated: false,
      createdAt: Date.now(),
    });
  },
});

/**
 * Get onboarding teaser by email (for preview screen)
 */
export const getOnboardingTeaserByEmail = internalQuery({
  args: { email: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("onboardingTeasers"),
      title: v.string(),
      teaserText: v.string(),
      prompt: v.string(),
      childName: v.string(),
      fullStoryGenerated: v.boolean(),
      linkedBookId: v.optional(v.id("books")),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const teaser = await ctx.db
      .query("onboardingTeasers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!teaser) return null;

    return {
      _id: teaser._id,
      title: teaser.title,
      teaserText: teaser.teaserText,
      prompt: teaser.prompt,
      childName: teaser.childName,
      fullStoryGenerated: teaser.fullStoryGenerated,
      linkedBookId: teaser.linkedBookId,
    };
  },
});

/**
 * Link teaser to user after signup
 */
export const linkTeaserToUser = internalMutation({
  args: {
    email: v.string(),
    userId: v.id("users"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const teaser = await ctx.db
      .query("onboardingTeasers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!teaser) return false;

    await ctx.db.patch(teaser._id, { userId: args.userId });
    return true;
  },
});
