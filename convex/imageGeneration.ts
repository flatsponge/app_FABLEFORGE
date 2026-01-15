"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  getAuthUserIdForAction,
  requireAuthForAction,
} from "./actionAuthHelpers";
import { generateImageUrl, getImageApiKey } from "./aiProviders";

type RateLimitResult = {
  hasGenerated: boolean;
  existingStorageId: Id<"_storage"> | null;
};

const MASCOT_STYLE_PROMPT = `Simple cute humanoid chibi mascot for a children's moral-values storybook app. Anthropomorphic (standing upright on two legs), full-body, centered, facing slightly 3/4. Rounded proportions, big gentle eyes, soft smile, small blush cheeks. Hands visible (soft mitten-like hooves/paws). Very simple shapes, minimal linework, flat colors only, no gradients, no texture, no complex highlights. Pure white background (#FFFFFF). NO shadows of any kind. No scene, no props, no text, no watermark, no border.`;

function buildMascotPrompt(userDescription: string): string {
  return `${userDescription}. ${MASCOT_STYLE_PROMPT}`;
}

export const generateMascotFromDescription = action({
  args: {
    description: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    storageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdForAction(ctx);
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const rateLimit: RateLimitResult = await ctx.runQuery(internal.mascotHelpers.checkRateLimit, {
      userId: userId as Id<"users">,
    });

    if (rateLimit.hasGenerated) {
      if (rateLimit.existingStorageId) {
        const url = await ctx.storage.getUrl(rateLimit.existingStorageId);
        return {
          success: true,
          storageId: rateLimit.existingStorageId,
          imageUrl: url ?? undefined,
          error: "You have already generated a mascot. Returning your existing one.",
        };
      }
      return { success: false, error: "You have already generated a mascot" };
    }

    const apiKey = getImageApiKey();
    if (!apiKey) {
      return { success: false, error: "Image generation service not configured" };
    }

    try {
      const fullPrompt = buildMascotPrompt(args.description);
      const imageUrl = await generateImageUrl(apiKey, {
        positivePrompt: fullPrompt,
      });

      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        return { success: false, error: "Failed to download generated image" };
      }

      const imageBlob = await imageResponse.blob();
      const storageId = await ctx.storage.store(imageBlob);

      await ctx.runMutation(internal.mascotHelpers.recordGeneration, {
        userId: userId as Id<"users">,
        storageId,
        generationType: "text",
        prompt: args.description,
      });

      const storedUrl = await ctx.storage.getUrl(storageId);

      return {
        success: true,
        storageId,
        imageUrl: storedUrl ?? undefined,
      };
    } catch (error) {
      console.error("Error generating mascot:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

const IMAGE_TO_MASCOT_PROMPT = `Transform the subject in the reference image into a cute chibi mascot character for a children's storybook app. Create a simple anthropomorphic (standing upright on two legs) humanoid chibi version of the subject. Keep the essence, personality, and recognizable features from the reference while making it a rounded, cute mascot with big gentle eyes, soft smile, and small blush cheeks. Full-body view, centered, facing slightly 3/4. Hands visible (soft mitten-like paws). Very simple shapes, minimal linework, flat colors only, no gradients, no texture, no complex highlights. Pure white background (#FFFFFF). NO shadows of any kind. No scene, no props, no text, no watermark, no border.`;

export const generateMascotFromImage = action({
  args: {
    sourceImageId: v.id("_storage"),
  },
  returns: v.object({
    success: v.boolean(),
    storageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdForAction(ctx);
    if (!userId) {
      return { success: false, error: "Not authenticated. Please try logging in again." };
    }

    const rateLimit: RateLimitResult = await ctx.runQuery(internal.mascotHelpers.checkRateLimit, {
      userId: userId as Id<"users">,
    });

    if (rateLimit.hasGenerated) {
      if (rateLimit.existingStorageId) {
        const url = await ctx.storage.getUrl(rateLimit.existingStorageId);
        return {
          success: true,
          storageId: rateLimit.existingStorageId,
          imageUrl: url ?? undefined,
          error: "You have already generated a mascot. Returning your existing one.",
        };
      }
      return { success: false, error: "You have already generated a mascot" };
    }

    const apiKey = getImageApiKey();
    if (!apiKey) {
      return { success: false, error: "Image generation service not configured" };
    }

    try {
      const sourceImageUrl = await ctx.storage.getUrl(args.sourceImageId);
      if (!sourceImageUrl) {
        return { success: false, error: "Source image not found" };
      }

      const imageUrl = await generateImageUrl(apiKey, {
        positivePrompt: IMAGE_TO_MASCOT_PROMPT,
        referenceImages: [sourceImageUrl],
      });

      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        return { success: false, error: "Failed to download generated image" };
      }

      const imageBlob = await imageResponse.blob();
      const storageId = await ctx.storage.store(imageBlob);

      await ctx.runMutation(internal.mascotHelpers.recordGeneration, {
        userId: userId as Id<"users">,
        storageId,
        generationType: "image",
      });

      const storedUrl = await ctx.storage.getUrl(storageId);

      return {
        success: true,
        storageId,
        imageUrl: storedUrl ?? undefined,
      };
    } catch (error) {
      console.error("Error generating mascot from image:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

export const generateUploadUrl = action({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const userId = await requireAuthForAction(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getExistingMascot = action({
  args: {},
  returns: v.object({
    hasGenerated: v.boolean(),
    storageId: v.union(v.id("_storage"), v.null()),
    imageUrl: v.union(v.string(), v.null()),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserIdForAction(ctx);
    if (!userId) {
      return { hasGenerated: false, storageId: null, imageUrl: null };
    }

    const rateLimit: RateLimitResult = await ctx.runQuery(internal.mascotHelpers.checkRateLimit, {
      userId: userId as Id<"users">,
    });

    if (rateLimit.hasGenerated && rateLimit.existingStorageId) {
      const url = await ctx.storage.getUrl(rateLimit.existingStorageId);
      return {
        hasGenerated: true,
        storageId: rateLimit.existingStorageId,
        imageUrl: url,
      };
    }

    return { hasGenerated: false, storageId: null, imageUrl: null };
  },
});

type MascotOutfitResult = {
  outfitId: Id<"mascotOutfit"> | null;
  originalMascotId: Id<"_storage">;
  clothedMascotId: Id<"_storage"> | null;
  currentMascotId: Id<"_storage">;
  equippedClothes: string | null;
  equippedClothesStorageId: Id<"_storage"> | null;
  equippedAccessory: string | null;
  equippedAccessoryType: "hat" | "toy" | null;
  equippedAccessoryStorageId: Id<"_storage"> | null;
  generationHistory: Array<{
    itemType: string;
    itemId: string;
    storageId: Id<"_storage">;
    generatedAt: number;
  }>;
};

function buildClothesPrompt(clothesDescription: string): string {
  return `Take the cute chibi mascot character from reference image 1 and dress it with the clothing item from reference image 2. IMPORTANT: The clothing item is ${clothesDescription}. The mascot must be wearing EXACTLY this item. Keep the exact same mascot design, face, body shape, colors, and cute chibi style. Full-body view, centered, pure white background (#FFFFFF), no shadows, no additional props or scene elements.`;
}

function buildAccessoryPrompt(accessoryDescription: string, accessoryType: "hat" | "toy"): string {
  const placement = accessoryType === "hat" ? "on its head" : "as an accessory";
  return `Take the cute chibi mascot character from reference image 1 (keeping any clothes it's wearing) and add the ${accessoryType} from reference image 2 ${placement}. IMPORTANT: The accessory is ${accessoryDescription}. The mascot must be wearing/holding EXACTLY this item. Keep the existing outfit if present. Keep the exact same mascot design, face, body shape, colors, and cute chibi style. Full-body view, centered, pure white background (#FFFFFF), no shadows, no additional props or scene elements.`;
}

export const addClothesToMascot = action({
  args: {
    clothesId: v.string(),
    clothesDescription: v.string(),
    clothesImageStorageId: v.id("_storage"),
    mascotStorageId: v.optional(v.id("_storage")),
  },
  returns: v.object({
    success: v.boolean(),
    storageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdForAction(ctx);
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const apiKey = getImageApiKey();
    if (!apiKey) {
      return { success: false, error: "Image generation service not configured" };
    }

    try {
      const outfit: MascotOutfitResult | null = await ctx.runQuery(
        internal.mascotHelpers.getMascotOutfitByUser,
        { userId: userId as Id<"users"> }
      );

      let originalMascotId: Id<"_storage">;
      if (!outfit && args.mascotStorageId) {
        originalMascotId = args.mascotStorageId;
      } else if (outfit) {
        originalMascotId = outfit.originalMascotId;
      } else {
        return { success: false, error: "No mascot found. Please upload a base avatar first." };
      }

      const originalMascotUrl = await ctx.storage.getUrl(originalMascotId);
      if (!originalMascotUrl) {
        return { success: false, error: "Original mascot image not found" };
      }

      const clothesImageUrl = await ctx.storage.getUrl(args.clothesImageStorageId);
      if (!clothesImageUrl) {
        return { success: false, error: "Clothes image not found" };
      }

      const fullPrompt = buildClothesPrompt(args.clothesDescription);

      const imageUrl = await generateImageUrl(apiKey, {
        positivePrompt: fullPrompt,
        referenceImages: [originalMascotUrl, clothesImageUrl],
      });

      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        return { success: false, error: "Failed to download generated image" };
      }

      const imageBlob = await imageResponse.blob();
      const newStorageId = await ctx.storage.store(imageBlob);

      await ctx.runMutation(internal.mascotHelpers.updateMascotOutfitClothes, {
        userId: userId as Id<"users">,
        clothesId: args.clothesId,
        clothesStorageId: args.clothesImageStorageId,
        newMascotStorageId: newStorageId,
        originalMascotId,
      });

      const storedUrl = await ctx.storage.getUrl(newStorageId);

      return {
        success: true,
        storageId: newStorageId,
        imageUrl: storedUrl ?? undefined,
      };
    } catch (error) {
      console.error("Error adding clothes to mascot:", error);
      return {
        success: false,
        error: error instanceof Error
          ? `Failed to generate clothed mascot: ${error.message}`
          : "Unknown error occurred",
      };
    }
  },
});

export const addAccessoryToMascot = action({
  args: {
    accessoryId: v.string(),
    accessoryType: v.union(v.literal("hat"), v.literal("toy")),
    accessoryDescription: v.string(),
    accessoryImageStorageId: v.id("_storage"),
    mascotStorageId: v.optional(v.id("_storage")),
  },
  returns: v.object({
    success: v.boolean(),
    storageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdForAction(ctx);
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const apiKey = getImageApiKey();
    if (!apiKey) {
      return { success: false, error: "Image generation service not configured" };
    }

    try {
      const outfit: MascotOutfitResult | null = await ctx.runQuery(
        internal.mascotHelpers.getMascotOutfitByUser,
        { userId: userId as Id<"users"> }
      );

      let originalMascotId: Id<"_storage">;
      let baseMascotId: Id<"_storage">;

      if (!outfit && args.mascotStorageId) {
        originalMascotId = args.mascotStorageId;
        baseMascotId = args.mascotStorageId;
      } else if (outfit) {
        originalMascotId = outfit.originalMascotId;
        baseMascotId = outfit.clothedMascotId ?? outfit.originalMascotId;
      } else {
        return { success: false, error: "No mascot found. Please upload a base avatar first." };
      }

      const baseMascotUrl = await ctx.storage.getUrl(baseMascotId);
      if (!baseMascotUrl) {
        return { success: false, error: "Base mascot image not found" };
      }

      const accessoryImageUrl = await ctx.storage.getUrl(args.accessoryImageStorageId);
      if (!accessoryImageUrl) {
        return { success: false, error: "Accessory image not found" };
      }

      const fullPrompt = buildAccessoryPrompt(args.accessoryDescription, args.accessoryType);

      const imageUrl = await generateImageUrl(apiKey, {
        positivePrompt: fullPrompt,
        referenceImages: [baseMascotUrl, accessoryImageUrl],
      });

      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        return { success: false, error: "Failed to download generated image" };
      }

      const imageBlob = await imageResponse.blob();
      const newStorageId = await ctx.storage.store(imageBlob);

      await ctx.runMutation(internal.mascotHelpers.updateMascotOutfitAccessory, {
        userId: userId as Id<"users">,
        accessoryId: args.accessoryId,
        accessoryType: args.accessoryType,
        accessoryStorageId: args.accessoryImageStorageId,
        newMascotStorageId: newStorageId,
        originalMascotId,
      });

      const storedUrl = await ctx.storage.getUrl(newStorageId);

      return {
        success: true,
        storageId: newStorageId,
        imageUrl: storedUrl ?? undefined,
      };
    } catch (error) {
      console.error("Error adding accessory to mascot:", error);
      return {
        success: false,
        error: error instanceof Error
          ? `Failed to generate accessorized mascot: ${error.message}`
          : "Unknown error occurred",
      };
    }
  },
});

type ResetOutfitResult = {
  success: boolean;
  storageId?: Id<"_storage">;
  imageUrl?: string;
  error?: string;
};

export const resetMascotOutfit = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    storageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx): Promise<ResetOutfitResult> => {
    const userId = await getAuthUserIdForAction(ctx);
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      const outfit: MascotOutfitResult | null = await ctx.runQuery(
        internal.mascotHelpers.getMascotOutfitByUser,
        { userId: userId as Id<"users"> }
      );

      if (!outfit) {
        return { success: false, error: "No mascot outfit found" };
      }

      await ctx.runMutation(internal.mascotHelpers.resetMascotOutfitInternal, {
        userId: userId as Id<"users">,
      });

      const originalUrl = await ctx.storage.getUrl(outfit.originalMascotId);

      return {
        success: true,
        storageId: outfit.originalMascotId,
        imageUrl: originalUrl ?? undefined,
      };
    } catch (error) {
      console.error("Error resetting mascot outfit:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});
