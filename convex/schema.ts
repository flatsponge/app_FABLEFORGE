import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const subSkillValidator = v.object({
  name: v.string(),
  value: v.number(),
});

const skillValidator = v.object({
  progress: v.number(),
  subSkills: v.array(subSkillValidator),
});

// Validator for tracking each generation step in mascot outfit history
const generationHistoryItemValidator = v.object({
  itemType: v.string(),
  itemId: v.string(),
  storageId: v.id("_storage"),
  generatedAt: v.number(),
});

export default defineSchema({
  ...authTables,

  userCredits: defineTable({
    userId: v.id("users"),
    balance: v.number(),
    lastRegenTime: v.number(),
    isStoryMax: v.boolean(),
    storyMaxExpiresAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  onboardingResponses: defineTable({
    userId: v.id("users"),
    childName: v.string(),
    childAge: v.string(),
    childBirthMonth: v.number(),
    childBirthYear: v.number(),
    gender: v.string(),
    childPersonality: v.array(v.string()),
    primaryGoal: v.array(v.string()),
    goalsTimeline: v.string(),
    parentingStyle: v.string(),
    parentChallenges: v.array(v.string()),
    parentReaction: v.string(),
    previousAttempts: v.string(),
    dailyRoutine: v.string(),
    readingTime: v.string(),
    storyLength: v.string(),
    storyThemes: v.array(v.string()),
    struggleBehavior: v.string(),
    aggressionTarget: v.optional(v.string()),
    aggressionFrequency: v.optional(v.string()),
    triggerSituations: v.array(v.string()),
    struggleAreas: v.array(v.string()),
    struggleFrequency: v.string(),
    moralScore: v.number(),
    mascotName: v.optional(v.string()),
    generatedMascotId: v.optional(v.id("_storage")),
    // Wardrobe unlock - unlocked after reading 90%+ of a story
    hasUnlockedWardrobe: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),

  userSkills: defineTable({
    userId: v.id("users"),
    overallScore: v.number(),
    empathy: skillValidator,
    bravery: skillValidator,
    honesty: skillValidator,
    teamwork: skillValidator,
    creativity: skillValidator,
    gratitude: skillValidator,
    problemSolving: skillValidator,
    responsibility: skillValidator,
    patience: skillValidator,
    curiosity: skillValidator,
  }).index("by_user", ["userId"]),

  // Track how each book contributed to skill progress
  skillContributions: defineTable({
    userId: v.id("users"),
    bookId: v.id("books"),
    skillKey: v.string(), // e.g., "empathy", "bravery"
    pointsAdded: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_skill", ["userId", "skillKey"])
    .index("by_book", ["bookId"]),

  // Track mascot generations for rate limiting (1 per email)
  mascotGenerations: defineTable({
    email: v.string(),
    storageId: v.id("_storage"),
    generationType: v.union(v.literal("text"), v.literal("image")),
    prompt: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // Track current mascot outfit state
  // Due to FLUX Kontext 2-image limit:
  // - Clothes: Always uses originalMascotId (bare mascot) + clothes image
  // - Accessories (hats OR toys - merged): Uses clothedMascotId (mascot with clothes) + accessory image
  mascotOutfit: defineTable({
    userId: v.id("users"),
    originalMascotId: v.id("_storage"), // Original bare mascot (never changes)
    clothedMascotId: v.optional(v.id("_storage")), // Mascot with clothes (used as base for accessories)
    currentMascotId: v.id("_storage"), // Latest generated mascot (final result)
    // Equipped items - clothes is separate, hat/toy merged into accessory
    equippedClothes: v.optional(v.string()), // e.g., "shirt-blue"
    equippedClothesStorageId: v.optional(v.id("_storage")),
    // Merged hat + toy into single accessory slot (user picks one OR the other)
    equippedAccessory: v.optional(v.string()), // e.g., "crown-gold" or "sunglasses"
    equippedAccessoryType: v.optional(v.union(v.literal("hat"), v.literal("toy"))), // Track which type
    equippedAccessoryStorageId: v.optional(v.id("_storage")),
    generationHistory: v.array(generationHistoryItemValidator),
  }).index("by_user", ["userId"]),

  // ============================================
  // STORY GENERATION TABLES
  // ============================================

  // Story generation jobs - tracks async generation progress
  storyJobs: defineTable({
    userId: v.id("users"),
    status: v.union(
      v.literal("queued"),
      v.literal("generating_story"),
      v.literal("generating_images"),
      v.literal("complete"),
      v.literal("failed"),
      v.literal("canceled")
    ),
    progress: v.number(), // 0-100
    reservedCredits: v.number(),
    error: v.optional(v.string()),
    // Input parameters
    mode: v.union(v.literal("creative"), v.literal("situation"), v.literal("auto")),
    prompt: v.string(),
    storyLength: v.union(v.literal("short"), v.literal("medium"), v.literal("long")),
    storyVibe: v.union(
      v.literal("energizing"),
      v.literal("soothing"),
      v.literal("whimsical"),
      v.literal("thoughtful")
    ),
    vocabularyLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    // Moral/value - either explicitly selected or auto-determined from lowest stat
    moral: v.string(), // e.g., "empathy", "patience", "honesty"
    moralAutoSelected: v.boolean(), // true if determined from lowest stat
    // Characters
    mascotStorageId: v.optional(v.id("_storage")),
    extraCharacterId: v.optional(v.string()), // e.g., "char-1" for Barky
    extraCharacterName: v.optional(v.string()),
    // Optional overrides
    locationId: v.optional(v.string()),
    locationName: v.optional(v.string()),
    voiceId: v.optional(v.string()),
    // Result - links to the generated book
    bookId: v.optional(v.id("books")),
    // Timestamps
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),

  // Generated books
  books: defineTable({
    userId: v.id("users"),
    jobId: v.id("storyJobs"),
    title: v.string(),
    description: v.string(),
    moral: v.string(),
    moralDescription: v.string(),
    // Story metadata
    pageCount: v.number(),
    storyLength: v.union(v.literal("short"), v.literal("medium"), v.literal("long")),
    vocabularyLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    storyVibe: v.union(
      v.literal("energizing"),
      v.literal("soothing"),
      v.literal("whimsical"),
      v.literal("thoughtful")
    ),
    // Cover image (first page or dedicated cover)
    coverImageStorageId: v.optional(v.id("_storage")),
    // Reading progress
    readingProgress: v.number(), // 0-100
    lastReadPageIndex: v.number(),
    // User feedback
    userRating: v.optional(v.union(v.literal("up"), v.literal("down"))),
    // Duration estimate in minutes
    durationMinutes: v.number(),
    // Timestamps
    createdAt: v.number(),
    lastReadAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_job", ["jobId"]),

  // Individual book pages
  bookPages: defineTable({
    bookId: v.id("books"),
    jobId: v.id("storyJobs"),
    pageIndex: v.number(), // 0-based
    // Content
    text: v.string(),
    // Image
    imagePrompt: v.string(), // The prompt used to generate the image
    imageStorageId: v.optional(v.id("_storage")),
    // Characters appearing on this page
    hasMascot: v.boolean(),
    hasExtraCharacter: v.boolean(),
    // Audio (for future implementation)
    audioStorageId: v.optional(v.id("_storage")),
  })
    .index("by_book", ["bookId"])
    .index("by_book_and_page", ["bookId", "pageIndex"])
    .index("by_job", ["jobId"]),

  // ============================================
  // ONBOARDING STORY TEASERS
  // ============================================

  // Story teasers generated during onboarding (before user account exists)
  // Converted to full story after payment
  onboardingTeasers: defineTable({
    email: v.string(), // Before user account exists
    userId: v.optional(v.id("users")), // Linked after signup
    prompt: v.string(), // Child's input (what they did today)
    childName: v.string(),
    childAge: v.string(),
    gender: v.string(),
    // Generated content
    title: v.string(),
    teaserText: v.string(), // First page text only (preview)
    // Full story generation status
    fullStoryGenerated: v.boolean(),
    linkedBookId: v.optional(v.id("books")),
    // Timestamps
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_user", ["userId"]),
});
