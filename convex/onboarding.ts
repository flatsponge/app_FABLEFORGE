import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUser, requireAuthUser } from "./authHelpers";

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
    generatedMascotId: v.optional(v.id("_storage")),
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
