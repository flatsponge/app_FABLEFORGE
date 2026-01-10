import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Validator for generation history items
const generationHistoryItemValidator = v.object({
  itemType: v.string(),
  itemId: v.string(),
  storageId: v.id("_storage"),
  generatedAt: v.number(),
});

// Internal query to check if user has already generated a mascot
export const checkRateLimit = internalQuery({
  args: { email: v.string() },
  returns: v.object({
    hasGenerated: v.boolean(),
    existingStorageId: v.union(v.id("_storage"), v.null()),
  }),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("mascotGenerations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    return {
      hasGenerated: existing !== null,
      existingStorageId: existing?.storageId ?? null,
    };
  },
});

// Internal mutation to record a mascot generation
export const recordGeneration = internalMutation({
  args: {
    email: v.string(),
    storageId: v.id("_storage"),
    generationType: v.union(v.literal("text"), v.literal("image")),
    prompt: v.optional(v.string()),
  },
  returns: v.id("mascotGenerations"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("mascotGenerations", {
      email: args.email,
      storageId: args.storageId,
      generationType: args.generationType,
      prompt: args.prompt,
    });
  },
});

// Internal query to get mascot outfit for a user
// Due to FLUX Kontext 2-image limit:
// - Clothes: Uses originalMascotId (bare) + clothes image
// - Accessories (hat OR toy): Uses clothedMascotId + accessory image
export const getMascotOutfitByEmail = internalQuery({
  args: { email: v.string() },
  returns: v.union(
    v.object({
      outfitId: v.union(v.id("mascotOutfit"), v.null()),
      originalMascotId: v.id("_storage"),
      clothedMascotId: v.union(v.id("_storage"), v.null()), // Mascot with clothes (base for accessories)
      currentMascotId: v.id("_storage"),
      // Clothes
      equippedClothes: v.union(v.string(), v.null()),
      equippedClothesStorageId: v.union(v.id("_storage"), v.null()),
      // Merged accessory (hat OR toy - only one allowed)
      equippedAccessory: v.union(v.string(), v.null()),
      equippedAccessoryType: v.union(v.literal("hat"), v.literal("toy"), v.null()),
      equippedAccessoryStorageId: v.union(v.id("_storage"), v.null()),
      generationHistory: v.array(generationHistoryItemValidator),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    if (!user) {
      return null;
    }

    const outfit = await ctx.db
      .query("mascotOutfit")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
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

    // No outfit yet - check if user has a generated mascot from onboarding
    const onboarding = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
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

// Internal mutation to update mascot outfit after adding CLOTHES
// Clothes always use the original bare mascot as base
// The result becomes the "clothedMascotId" for future accessory additions
export const updateMascotOutfitClothes = internalMutation({
  args: {
    email: v.string(),
    clothesId: v.string(),
    clothesStorageId: v.id("_storage"),
    newMascotStorageId: v.id("_storage"), // This becomes both clothedMascotId AND currentMascotId
    originalMascotId: v.id("_storage"),
  },
  returns: v.id("mascotOutfit"),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    if (!user) {
      throw new Error("User not found");
    }

    const existingOutfit = await ctx.db
      .query("mascotOutfit")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    const historyItem = {
      itemType: "clothes",
      itemId: args.clothesId,
      storageId: args.newMascotStorageId,
      generatedAt: Date.now(),
    };

    if (existingOutfit) {
      // Update existing outfit - when clothes change, reset accessory too
      // because the accessory was generated on top of old clothes
      await ctx.db.patch(existingOutfit._id, {
        equippedClothes: args.clothesId,
        equippedClothesStorageId: args.clothesStorageId,
        clothedMascotId: args.newMascotStorageId, // Store the clothed version
        currentMascotId: args.newMascotStorageId,
        // Clear accessory since clothes changed (it was on old clothes)
        equippedAccessory: undefined,
        equippedAccessoryType: undefined,
        equippedAccessoryStorageId: undefined,
        generationHistory: [...existingOutfit.generationHistory, historyItem],
      });
      return existingOutfit._id;
    } else {
      // Create new outfit record
      return await ctx.db.insert("mascotOutfit", {
        userId: user._id,
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

// Internal mutation to update mascot outfit after adding ACCESSORY (hat OR toy)
// Accessories use the clothedMascotId (or originalMascotId if no clothes) as base
export const updateMascotOutfitAccessory = internalMutation({
  args: {
    email: v.string(),
    accessoryId: v.string(),
    accessoryType: v.union(v.literal("hat"), v.literal("toy")),
    accessoryStorageId: v.id("_storage"),
    newMascotStorageId: v.id("_storage"),
    originalMascotId: v.id("_storage"),
  },
  returns: v.id("mascotOutfit"),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    if (!user) {
      throw new Error("User not found");
    }

    const existingOutfit = await ctx.db
      .query("mascotOutfit")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    const historyItem = {
      itemType: args.accessoryType,
      itemId: args.accessoryId,
      storageId: args.newMascotStorageId,
      generatedAt: Date.now(),
    };

    if (existingOutfit) {
      // Update existing outfit - only update accessory, keep clothes
      await ctx.db.patch(existingOutfit._id, {
        equippedAccessory: args.accessoryId,
        equippedAccessoryType: args.accessoryType,
        equippedAccessoryStorageId: args.accessoryStorageId,
        currentMascotId: args.newMascotStorageId,
        generationHistory: [...existingOutfit.generationHistory, historyItem],
      });
      return existingOutfit._id;
    } else {
      // Create new outfit record (no clothes, just accessory)
      return await ctx.db.insert("mascotOutfit", {
        userId: user._id,
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

// Internal mutation to reset mascot outfit
// Clears all equipped items and resets to original bare mascot
export const resetMascotOutfitInternal = internalMutation({
  args: { email: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    if (!user) {
      throw new Error("User not found");
    }

    const outfit = await ctx.db
      .query("mascotOutfit")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
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
