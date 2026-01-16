import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUser, requireAuthUser } from "./authHelpers";

/**
 * Check if an email is already registered in the system.
 * Used during signup to prevent duplicate accounts.
 */
export const checkEmailExists = query({
  args: { email: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    return existingUser !== null;
  },
});

/**
 * Get onboarding completion status for the authenticated user.
 * Used after login to determine if user needs to complete onboarding steps.
 */
export const getOnboardingStatus = query({
  args: {},
  returns: v.union(
    v.object({
      hasOnboardingData: v.boolean(),
      hasMascotName: v.boolean(),
      hasMascotImage: v.boolean(),
      isComplete: v.boolean(),
      childName: v.union(v.string(), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) {
      return null;
    }

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!onboarding) {
      return {
        hasOnboardingData: false,
        hasMascotName: false,
        hasMascotImage: false,
        isComplete: false,
        childName: null,
      };
    }

    const hasMascotName = !!onboarding.mascotName && onboarding.mascotName.trim() !== "";
    const hasMascotImage = !!onboarding.generatedMascotId;

    return {
      hasOnboardingData: true,
      hasMascotName,
      hasMascotImage,
      isComplete: hasMascotName && hasMascotImage,
      childName: onboarding.childName || null,
    };
  },
});

const subSkillValidator = v.object({
  name: v.string(),
  value: v.number(),
});

const skillValidator = v.object({
  progress: v.number(),
  subSkills: v.array(subSkillValidator),
});

export const saveOnboardingResponses = mutation({
  args: {
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
    parentReaction: v.array(v.string()),
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
    trafficSource: v.optional(v.string()),
    referralCode: v.optional(v.string()),
    vocabularyPreference: v.optional(v.union(
      v.literal("behind"),
      v.literal("average"),
      v.literal("advanced")
    )),
  },
  returns: v.id("onboardingResponses"),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);
    return await ctx.db.insert("onboardingResponses", {
      userId: user._id,
      ...args,
    });
  },
});

/**
 * Save generated mascot ID to existing onboarding record.
 */
export const saveGeneratedMascot = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!onboarding) {
      throw new Error("Onboarding record not found");
    }

    await ctx.db.patch(onboarding._id, {
      generatedMascotId: args.storageId,
    });

    return true;
  },
});

export const updateMascotName = mutation({
  args: {
    mascotName: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!onboarding) {
      throw new Error("Onboarding record not found");
    }

    await ctx.db.patch(onboarding._id, {
      mascotName: args.mascotName,
    });

    return true;
  },
});

export const saveUserSkills = mutation({
  args: {
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
  },
  returns: v.id("userSkills"),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);

    // Check if skills already exist for this user
    const existing = await ctx.db
      .query("userSkills")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("userSkills", {
      userId: user._id,
      ...args,
    });
  },
});

export const getUserSkills = query({
  args: {},
  returns: v.union(
    v.object({
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
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) {
      return null;
    }
    const skills = await ctx.db
      .query("userSkills")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!skills) {
      return null;
    }
    return {
      overallScore: skills.overallScore,
      empathy: skills.empathy,
      bravery: skills.bravery,
      honesty: skills.honesty,
      teamwork: skills.teamwork,
      creativity: skills.creativity,
      gratitude: skills.gratitude,
      problemSolving: skills.problemSolving,
      responsibility: skills.responsibility,
      patience: skills.patience,
      curiosity: skills.curiosity,
    };
  },
});

// Validator for generation history items
const generationHistoryItemValidator = v.object({
  itemType: v.string(),
  itemId: v.string(),
  storageId: v.id("_storage"),
  generatedAt: v.number(),
});

/**
 * Get user progress including wardrobe unlock status
 */
export const getUserProgress = query({
  args: {},
  returns: v.union(
    v.object({
      hasUnlockedWardrobe: v.boolean(),
      generatedMascotId: v.union(v.id("_storage"), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) {
      return null;
    }
    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!onboarding) {
      return null;
    }
    return {
      hasUnlockedWardrobe: onboarding.hasUnlockedWardrobe ?? false,
      generatedMascotId: onboarding.generatedMascotId ?? null,
    };
  },
});

/**
 * Unlock wardrobe - called when child reaches 90%+ reading progress
 */
export const unlockWardrobe = mutation({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const user = await requireAuthUser(ctx);
    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!onboarding) {
      throw new Error("Onboarding not found");
    }

    // Only update if not already unlocked
    if (!onboarding.hasUnlockedWardrobe) {
      await ctx.db.patch(onboarding._id, { hasUnlockedWardrobe: true });
    }

    return true;
  },
});

/**
 * Get the current mascot outfit state with URLs
 * Updated for merged accessories (hat OR toy - only one allowed)
 */
export const getMascotOutfit = query({
  args: {},
  returns: v.union(
    v.object({
      originalMascotId: v.id("_storage"),
      clothedMascotId: v.union(v.id("_storage"), v.null()), // Mascot with clothes (base for accessories)
      currentMascotId: v.id("_storage"),
      currentMascotUrl: v.union(v.string(), v.null()),
      equippedClothes: v.union(v.string(), v.null()),
      // Merged accessory (hat OR toy - only one allowed due to 2-image limit)
      equippedAccessory: v.union(v.string(), v.null()),
      equippedAccessoryType: v.union(v.literal("hat"), v.literal("toy"), v.null()),
      generationHistory: v.array(generationHistoryItemValidator),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) {
      return null;
    }
    const outfit = await ctx.db
      .query("mascotOutfit")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!outfit) {
      // No outfit yet - check if user has a generated mascot
      const onboarding = await ctx.db
        .query("onboardingResponses")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();
      if (onboarding?.generatedMascotId) {
        // Return base mascot as both original and current
        const url = await ctx.storage.getUrl(onboarding.generatedMascotId);
        return {
          originalMascotId: onboarding.generatedMascotId,
          clothedMascotId: null,
          currentMascotId: onboarding.generatedMascotId,
          currentMascotUrl: url,
          equippedClothes: null,
          equippedAccessory: null,
          equippedAccessoryType: null,
          generationHistory: [],
        };
      }
      return null;
    }

    // Get URL for current mascot
    const currentUrl = await ctx.storage.getUrl(outfit.currentMascotId);

    return {
      originalMascotId: outfit.originalMascotId,
      clothedMascotId: outfit.clothedMascotId ?? null,
      currentMascotId: outfit.currentMascotId,
      currentMascotUrl: currentUrl,
      equippedClothes: outfit.equippedClothes ?? null,
      equippedAccessory: outfit.equippedAccessory ?? null,
      equippedAccessoryType: outfit.equippedAccessoryType ?? null,
      generationHistory: outfit.generationHistory,
    };
  },
});

export const getVocabularySettings = query({
  args: {},
  returns: v.union(
    v.object({
      vocabularyPreference: v.union(
        v.literal("behind"),
        v.literal("average"),
        v.literal("advanced"),
        v.null()
      ),
      vocabularyOverride: v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced"),
        v.null()
      ),
      childBirthMonth: v.union(v.number(), v.null()),
      childBirthYear: v.union(v.number(), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!onboarding) return null;

    return {
      vocabularyPreference: onboarding.vocabularyPreference ?? null,
      vocabularyOverride: onboarding.vocabularyOverride ?? null,
      childBirthMonth: onboarding.childBirthMonth ?? null,
      childBirthYear: onboarding.childBirthYear ?? null,
    };
  },
});

export const updateVocabularyOverride = mutation({
  args: {
    vocabularyOverride: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.null()
    ),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!onboarding) {
      throw new Error("Onboarding record not found");
    }

    await ctx.db.patch(onboarding._id, {
      vocabularyOverride: args.vocabularyOverride ?? undefined,
    });

    return true;
  },
});

export const getDefaultReadingMode = query({
  args: {},
  returns: v.union(
    v.literal("autoplay"),
    v.literal("child"),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!onboarding) return null;

    return onboarding.defaultReadingMode ?? null;
  },
});

export const updateDefaultReadingMode = mutation({
  args: {
    defaultReadingMode: v.union(
      v.literal("autoplay"),
      v.literal("child"),
      v.null()
    ),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!onboarding) {
      throw new Error("Onboarding record not found");
    }

    await ctx.db.patch(onboarding._id, {
      defaultReadingMode: args.defaultReadingMode ?? undefined,
    });

    return true;
  },
});

/**
 * Get the selected background for child hub
 */
export const getSelectedBackground = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    return onboarding?.selectedBackground ?? null;
  },
});

/**
 * Update the selected background for child hub
 */
export const updateSelectedBackground = mutation({
  args: {
    backgroundId: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!onboarding) {
      throw new Error("Onboarding record not found");
    }

    await ctx.db.patch(onboarding._id, {
      selectedBackground: args.backgroundId,
    });

    return true;
  },
});

/**
 * Get the default story length from onboarding preferences.
 * Maps onboarding values to story generator values:
 * - "quick" -> "short"
 * - "medium" -> "medium"  
 * - "long" -> "long"
 * - "varies" -> "medium" (defaults to medium when flexible)
 */
export const getDefaultStoryLength = query({
  args: {},
  returns: v.union(
    v.literal("short"),
    v.literal("medium"),
    v.literal("long"),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!onboarding?.storyLength) return null;

    // Map onboarding story length to generator story length
    const mapping: Record<string, "short" | "medium" | "long"> = {
      quick: "short",
      medium: "medium",
      long: "long",
      varies: "medium", // Default to medium when user selected flexible
    };

    return mapping[onboarding.storyLength] ?? null;
  },
});
