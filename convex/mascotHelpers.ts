import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const generationHistoryItemValidator = v.object({
  itemType: v.string(),
  itemId: v.string(),
  storageId: v.id("_storage"),
  generatedAt: v.number(),
});

export const checkRateLimit = internalQuery({
  args: { userId: v.id("users") },
  returns: v.object({
    hasGenerated: v.boolean(),
    existingStorageId: v.union(v.id("_storage"), v.null()),
  }),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("mascotGenerations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    return {
      hasGenerated: existing !== null,
      existingStorageId: existing?.storageId ?? null,
    };
  },
});

export const recordGeneration = internalMutation({
  args: {
    userId: v.id("users"),
    storageId: v.id("_storage"),
    generationType: v.union(v.literal("text"), v.literal("image")),
    prompt: v.optional(v.string()),
  },
  returns: v.id("mascotGenerations"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("mascotGenerations", {
      userId: args.userId,
      storageId: args.storageId,
      generationType: args.generationType,
      prompt: args.prompt,
    });
  },
});

export const getMascotOutfitByUser = internalQuery({
  args: { userId: v.id("users") },
  returns: v.union(
    v.object({
      outfitId: v.union(v.id("mascotOutfit"), v.null()),
      originalMascotId: v.id("_storage"),
      clothedMascotId: v.union(v.id("_storage"), v.null()),
      currentMascotId: v.id("_storage"),
      equippedClothes: v.union(v.string(), v.null()),
      equippedClothesStorageId: v.union(v.id("_storage"), v.null()),
      equippedAccessory: v.union(v.string(), v.null()),
      equippedAccessoryType: v.union(v.literal("hat"), v.literal("toy"), v.null()),
      equippedAccessoryStorageId: v.union(v.id("_storage"), v.null()),
      generationHistory: v.array(generationHistoryItemValidator),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const outfit = await ctx.db
      .query("mascotOutfit")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (outfit) {
      return {
        outfitId: outfit._id,
        originalMascotId: outfit.originalMascotId,
        clothedMascotId: outfit.clothedMascotId ?? null,
        currentMascotId: outfit.currentMascotId,
        equippedClothes: outfit.equippedClothes ?? null,
        equippedClothesStorageId: outfit.equippedClothesStorageId ?? null,
        equippedAccessory: outfit.equippedAccessory ?? null,
        equippedAccessoryType: outfit.equippedAccessoryType ?? null,
        equippedAccessoryStorageId: outfit.equippedAccessoryStorageId ?? null,
        generationHistory: outfit.generationHistory,
      };
    }

    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (onboarding?.generatedMascotId) {
      return {
        outfitId: null,
        originalMascotId: onboarding.generatedMascotId,
        clothedMascotId: null,
        currentMascotId: onboarding.generatedMascotId,
        equippedClothes: null,
        equippedClothesStorageId: null,
        equippedAccessory: null,
        equippedAccessoryType: null,
        equippedAccessoryStorageId: null,
        generationHistory: [],
      };
    }

    return null;
  },
});

export const updateMascotOutfitClothes = internalMutation({
  args: {
    userId: v.id("users"),
    clothesId: v.string(),
    clothesStorageId: v.id("_storage"),
    newMascotStorageId: v.id("_storage"),
    originalMascotId: v.id("_storage"),
  },
  returns: v.id("mascotOutfit"),
  handler: async (ctx, args) => {
    const existingOutfit = await ctx.db
      .query("mascotOutfit")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    const historyItem = {
      itemType: "clothes",
      itemId: args.clothesId,
      storageId: args.newMascotStorageId,
      generatedAt: Date.now(),
    };

    if (existingOutfit) {
      await ctx.db.patch(existingOutfit._id, {
        equippedClothes: args.clothesId,
        equippedClothesStorageId: args.clothesStorageId,
        clothedMascotId: args.newMascotStorageId,
        currentMascotId: args.newMascotStorageId,
        equippedAccessory: undefined,
        equippedAccessoryType: undefined,
        equippedAccessoryStorageId: undefined,
        generationHistory: [...existingOutfit.generationHistory, historyItem],
      });
      return existingOutfit._id;
    } else {
      return await ctx.db.insert("mascotOutfit", {
        userId: args.userId,
        originalMascotId: args.originalMascotId,
        clothedMascotId: args.newMascotStorageId,
        currentMascotId: args.newMascotStorageId,
        equippedClothes: args.clothesId,
        equippedClothesStorageId: args.clothesStorageId,
        generationHistory: [historyItem],
      });
    }
  },
});

export const updateMascotOutfitAccessory = internalMutation({
  args: {
    userId: v.id("users"),
    accessoryId: v.string(),
    accessoryType: v.union(v.literal("hat"), v.literal("toy")),
    accessoryStorageId: v.id("_storage"),
    newMascotStorageId: v.id("_storage"),
    originalMascotId: v.id("_storage"),
  },
  returns: v.id("mascotOutfit"),
  handler: async (ctx, args) => {
    const existingOutfit = await ctx.db
      .query("mascotOutfit")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    const historyItem = {
      itemType: args.accessoryType,
      itemId: args.accessoryId,
      storageId: args.newMascotStorageId,
      generatedAt: Date.now(),
    };

    if (existingOutfit) {
      await ctx.db.patch(existingOutfit._id, {
        equippedAccessory: args.accessoryId,
        equippedAccessoryType: args.accessoryType,
        equippedAccessoryStorageId: args.accessoryStorageId,
        currentMascotId: args.newMascotStorageId,
        generationHistory: [...existingOutfit.generationHistory, historyItem],
      });
      return existingOutfit._id;
    } else {
      return await ctx.db.insert("mascotOutfit", {
        userId: args.userId,
        originalMascotId: args.originalMascotId,
        currentMascotId: args.newMascotStorageId,
        equippedAccessory: args.accessoryId,
        equippedAccessoryType: args.accessoryType,
        equippedAccessoryStorageId: args.accessoryStorageId,
        generationHistory: [historyItem],
      });
    }
  },
});

export const resetMascotOutfitInternal = internalMutation({
  args: { userId: v.id("users") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const outfit = await ctx.db
      .query("mascotOutfit")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (outfit) {
      await ctx.db.patch(outfit._id, {
        currentMascotId: outfit.originalMascotId,
        clothedMascotId: undefined,
        equippedClothes: undefined,
        equippedClothesStorageId: undefined,
        equippedAccessory: undefined,
        equippedAccessoryType: undefined,
        equippedAccessoryStorageId: undefined,
        generationHistory: [],
      });
      return true;
    }

    return false;
  },
});
