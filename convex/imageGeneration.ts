"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  getAuthEmailForAction,
  logAuthDebugForAction,
} from "./actionAuthHelpers";

type RateLimitResult = {
  hasGenerated: boolean;
  existingStorageId: Id<"_storage"> | null;
};

// Mascot style prompt template - creates chibi humanoid characters
const MASCOT_STYLE_PROMPT = `Simple cute humanoid chibi mascot for a children's moral-values storybook app. Anthropomorphic (standing upright on two legs), full-body, centered, facing slightly 3/4. Rounded proportions, big gentle eyes, soft smile, small blush cheeks. Hands visible (soft mitten-like hooves/paws). Very simple shapes, minimal linework, flat colors only, no gradients, no texture, no complex highlights. Pure white background (#FFFFFF). NO shadows of any kind. No scene, no props, no text, no watermark, no border.`;

// Build the full prompt combining user description with mascot style
function buildMascotPrompt(userDescription: string): string {
  return `${userDescription}. ${MASCOT_STYLE_PROMPT}`;
}

// Runware API configuration
const RUNWARE_API_URL = "https://api.runware.ai/v1";

// FLUX.1 Kontext model - supports reference images for image-to-image transformations
// This is used for both onboarding (photo to mascot) and child-hub (mascot dressing)
const FLUX_KONTEXT_MODEL = "runware:106@1";

interface RunwareImageResponse {
  data: Array<{
    taskType: string;
    imageUUID: string;
    taskUUID: string;
    seed: number;
    imageURL: string;
  }>;
}

// Generate mascot from text description
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
    // Get authenticated user's email
    const email = await getAuthEmailForAction(ctx);
    if (!email) {
      return { success: false, error: "Not authenticated" };
    }

    // Check rate limit (using helper from mascotHelpers.ts)
    const rateLimit: RateLimitResult = await ctx.runQuery(internal.mascotHelpers.checkRateLimit, {
      email,
    });

    if (rateLimit.hasGenerated) {
      // Return existing image instead of error
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

    // Get API key from environment
    const apiKey = process.env.RUNWARE_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Image generation service not configured" };
    }

    try {
      // Build the mascot prompt
      const fullPrompt = buildMascotPrompt(args.description);

      // Call Runware API
      const response = await fetch(RUNWARE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify([
          {
            taskType: "imageInference",
            taskUUID: crypto.randomUUID(),
            model: "runware:101@1", // FLUX.1 Dev
            positivePrompt: fullPrompt,
            width: 1024,
            height: 1024,
            steps: 30,
            numberResults: 1,
          },
        ]),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Runware API error:", errorText);
        return { success: false, error: "Failed to generate image" };
      }

      const result = (await response.json()) as RunwareImageResponse;

      if (!result.data || result.data.length === 0) {
        return { success: false, error: "No image generated" };
      }

      const imageUrl = result.data[0].imageURL;

      // Download the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        return { success: false, error: "Failed to download generated image" };
      }

      const imageBlob = await imageResponse.blob();

      // Upload to Convex storage
      const storageId = await ctx.storage.store(imageBlob);

      // Record the generation (using helper from mascotHelpers.ts)
      await ctx.runMutation(internal.mascotHelpers.recordGeneration, {
        email,
        storageId,
        generationType: "text",
        prompt: args.description,
      });

      // Get the storage URL
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

// Prompt for image-to-image mascot transformation using FLUX Kontext
// The reference image is the uploaded photo, and we transform it into a chibi mascot
const IMAGE_TO_MASCOT_PROMPT = `Transform the subject in the reference image into a cute chibi mascot character for a children's storybook app. Create a simple anthropomorphic (standing upright on two legs) humanoid chibi version of the subject. Keep the essence, personality, and recognizable features from the reference while making it a rounded, cute mascot with big gentle eyes, soft smile, and small blush cheeks. Full-body view, centered, facing slightly 3/4. Hands visible (soft mitten-like paws). Very simple shapes, minimal linework, flat colors only, no gradients, no texture, no complex highlights. Pure white background (#FFFFFF). NO shadows of any kind. No scene, no props, no text, no watermark, no border.`;

// Generate mascot from uploaded image (image-to-image) using FLUX Kontext
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
    // Get authenticated user's email
    const email = await getAuthEmailForAction(ctx);
    if (!email) {
      await logAuthDebugForAction(ctx, "generateMascotFromImage: No email found");
      return { success: false, error: "Not authenticated. Please try logging in again." };
    }

    // Check rate limit
    const rateLimit: RateLimitResult = await ctx.runQuery(internal.mascotHelpers.checkRateLimit, {
      email,
    });

    if (rateLimit.hasGenerated) {
      // Return existing image instead of error
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

    // Get API key from environment
    const apiKey = process.env.RUNWARE_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Image generation service not configured" };
    }

    try {
      // Get the source image URL from Convex storage
      const sourceImageUrl = await ctx.storage.getUrl(args.sourceImageId);
      if (!sourceImageUrl) {
        return { success: false, error: "Source image not found" };
      }

      console.log("FLUX Kontext image-to-mascot generation:", {
        model: FLUX_KONTEXT_MODEL,
        prompt: IMAGE_TO_MASCOT_PROMPT,
        referenceImages: [sourceImageUrl],
      });

      // Call Runware API with FLUX Kontext using referenceImages
      // FLUX Kontext is better for image transformations as it understands reference images
      const response = await fetch(RUNWARE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify([
          {
            taskType: "imageInference",
            taskUUID: crypto.randomUUID(),
            model: FLUX_KONTEXT_MODEL, // FLUX.1 Kontext - better for reference-based generation
            positivePrompt: IMAGE_TO_MASCOT_PROMPT,
            referenceImages: [sourceImageUrl], // Reference image for transformation
            width: 1024,
            height: 1024,
            steps: 30,
            numberResults: 1,
          },
        ]),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Runware API error:", errorText);
        return { success: false, error: `Failed to generate image: ${errorText}` };
      }

      const result = (await response.json()) as RunwareImageResponse;

      if (!result.data || result.data.length === 0) {
        return { success: false, error: "No image generated" };
      }

      const imageUrl = result.data[0].imageURL;

      // Download the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        return { success: false, error: "Failed to download generated image" };
      }

      const imageBlob = await imageResponse.blob();

      // Upload to Convex storage
      const storageId = await ctx.storage.store(imageBlob);

      // Record the generation
      await ctx.runMutation(internal.mascotHelpers.recordGeneration, {
        email,
        storageId,
        generationType: "image",
      });

      // Get the storage URL
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

// Generate upload URL for source images
export const generateUploadUrl = action({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    // Verify user is authenticated
    const email = await getAuthEmailForAction(ctx);
    if (!email) {
      await logAuthDebugForAction(ctx, "generateUploadUrl: No email found");
      throw new Error("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Get mascot for current user (check if they already have one)
export const getExistingMascot = action({
  args: {},
  returns: v.object({
    hasGenerated: v.boolean(),
    storageId: v.union(v.id("_storage"), v.null()),
    imageUrl: v.union(v.string(), v.null()),
  }),
  handler: async (ctx) => {
    const email = await getAuthEmailForAction(ctx);
    if (!email) {
      return { hasGenerated: false, storageId: null, imageUrl: null };
    }

    const rateLimit: RateLimitResult = await ctx.runQuery(internal.mascotHelpers.checkRateLimit, {
      email,
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

// Type for mascot outfit query result - new schema with merged accessories
type MascotOutfitResult = {
  outfitId: Id<"mascotOutfit"> | null;
  originalMascotId: Id<"_storage">;
  clothedMascotId: Id<"_storage"> | null; // Mascot with clothes (base for accessories)
  currentMascotId: Id<"_storage">;
  equippedClothes: string | null;
  equippedClothesStorageId: Id<"_storage"> | null;
  equippedAccessory: string | null; // Merged hat/toy
  equippedAccessoryType: "hat" | "toy" | null;
  equippedAccessoryStorageId: Id<"_storage"> | null;
  generationHistory: Array<{
    itemType: string;
    itemId: string;
    storageId: Id<"_storage">;
    generatedAt: number;
  }>;
};

/**
 * Build prompt for adding CLOTHES to the bare mascot.
 * Reference Image 1: Original bare mascot
 * Reference Image 2: The clothing item
 */
function buildClothesPrompt(clothesDescription: string): string {
  return `Take the cute chibi mascot character from reference image 1 and dress it with the clothing item from reference image 2 (${clothesDescription}). The mascot should now be wearing the clothes naturally. Keep the exact same mascot design, face, body shape, colors, and cute chibi style. Full-body view, centered, pure white background (#FFFFFF), no shadows, no additional props or scene elements.`;
}

/**
 * Build prompt for adding an ACCESSORY (hat OR toy) to the clothed mascot.
 * Reference Image 1: Mascot with clothes (or bare if no clothes)
 * Reference Image 2: The accessory item (hat or toy)
 */
function buildAccessoryPrompt(accessoryDescription: string, accessoryType: "hat" | "toy"): string {
  const placement = accessoryType === "hat" ? "on its head" : "as an accessory";
  return `Take the cute chibi mascot character from reference image 1 (keeping any clothes it's wearing) and add the ${accessoryType} from reference image 2 (${accessoryDescription}) ${placement}. The mascot should now be wearing this accessory while keeping its existing outfit. Keep the exact same mascot design, face, body shape, colors, and cute chibi style. Full-body view, centered, pure white background (#FFFFFF), no shadows, no additional props or scene elements.`;
}

/**
 * Add CLOTHES to the mascot using FLUX.1 Kontext.
 * 
 * STRATEGY: Clothes always use the ORIGINAL BARE mascot as reference.
 * - Reference Image 1: Original bare mascot
 * - Reference Image 2: The clothing item
 * 
 * The result becomes the "clothedMascotId" which is used as base for accessories.
 * If clothes change, the accessory is cleared (it was on the old clothes).
 */
export const addClothesToMascot = action({
  args: {
    clothesId: v.string(),
    clothesDescription: v.string(),
    clothesImageStorageId: v.id("_storage"),
    mascotStorageId: v.optional(v.id("_storage")), // For users without custom mascot
  },
  returns: v.object({
    success: v.boolean(),
    storageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Get authenticated user's email
    const email = await getAuthEmailForAction(ctx);
    if (!email) {
      return { success: false, error: "Not authenticated" };
    }

    const apiKey = process.env.RUNWARE_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Image generation service not configured" };
    }

    try {
      // Get current mascot outfit state
      const outfit: MascotOutfitResult | null = await ctx.runQuery(
        internal.mascotHelpers.getMascotOutfitByEmail,
        { email }
      );

      // Determine the original mascot ID
      let originalMascotId: Id<"_storage">;
      if (!outfit && args.mascotStorageId) {
        originalMascotId = args.mascotStorageId;
      } else if (outfit) {
        originalMascotId = outfit.originalMascotId;
      } else {
        return { success: false, error: "No mascot found. Please upload a base avatar first." };
      }

      // Get the ORIGINAL BARE mascot image URL (Reference Image 1)
      const originalMascotUrl = await ctx.storage.getUrl(originalMascotId);
      if (!originalMascotUrl) {
        return { success: false, error: "Original mascot image not found" };
      }

      // Get the clothes image URL (Reference Image 2)
      const clothesImageUrl = await ctx.storage.getUrl(args.clothesImageStorageId);
      if (!clothesImageUrl) {
        return { success: false, error: "Clothes image not found" };
      }

      const fullPrompt = buildClothesPrompt(args.clothesDescription);

      console.log("FLUX Kontext CLOTHES generation:", {
        model: FLUX_KONTEXT_MODEL,
        prompt: fullPrompt,
        referenceImages: [originalMascotUrl, clothesImageUrl],
      });

      // Call Runware API
      const response = await fetch(RUNWARE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify([
          {
            taskType: "imageInference",
            taskUUID: crypto.randomUUID(),
            model: FLUX_KONTEXT_MODEL,
            positivePrompt: fullPrompt,
            referenceImages: [originalMascotUrl, clothesImageUrl],
            width: 1024,
            height: 1024,
            steps: 30,
            numberResults: 1,
          },
        ]),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Runware API error:", errorText);
        return { success: false, error: `Failed to generate clothed mascot: ${errorText}` };
      }

      const result = (await response.json()) as RunwareImageResponse;

      if (!result.data || result.data.length === 0) {
        return { success: false, error: "No image generated" };
      }

      // Download and store the generated image
      const imageResponse = await fetch(result.data[0].imageURL);
      if (!imageResponse.ok) {
        return { success: false, error: "Failed to download generated image" };
      }

      const imageBlob = await imageResponse.blob();
      const newStorageId = await ctx.storage.store(imageBlob);

      // Update mascot outfit - this becomes both clothedMascotId and currentMascotId
      // Note: This also clears any existing accessory since clothes changed
      await ctx.runMutation(internal.mascotHelpers.updateMascotOutfitClothes, {
        email,
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
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

/**
 * Add an ACCESSORY (hat OR toy - merged into one slot) to the mascot.
 * 
 * STRATEGY: Accessories use the CLOTHED mascot (or bare if no clothes) as reference.
 * - Reference Image 1: Clothed mascot (or original if no clothes)
 * - Reference Image 2: The accessory (hat or toy)
 * 
 * This allows clothes + accessory to work within the 2-image limit.
 * User can only have ONE accessory (either hat OR toy, not both).
 */
export const addAccessoryToMascot = action({
  args: {
    accessoryId: v.string(),
    accessoryType: v.union(v.literal("hat"), v.literal("toy")),
    accessoryDescription: v.string(),
    accessoryImageStorageId: v.id("_storage"),
    mascotStorageId: v.optional(v.id("_storage")), // For users without custom mascot
  },
  returns: v.object({
    success: v.boolean(),
    storageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Get authenticated user's email
    const email = await getAuthEmailForAction(ctx);
    if (!email) {
      return { success: false, error: "Not authenticated" };
    }

    const apiKey = process.env.RUNWARE_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Image generation service not configured" };
    }

    try {
      // Get current mascot outfit state
      const outfit: MascotOutfitResult | null = await ctx.runQuery(
        internal.mascotHelpers.getMascotOutfitByEmail,
        { email }
      );

      let originalMascotId: Id<"_storage">;
      let baseMascotId: Id<"_storage">; // The mascot to use as reference (clothed or bare)

      if (!outfit && args.mascotStorageId) {
        // No outfit yet, user uploaded base avatar
        originalMascotId = args.mascotStorageId;
        baseMascotId = args.mascotStorageId; // Use bare mascot
      } else if (outfit) {
        originalMascotId = outfit.originalMascotId;
        // Use clothed mascot if available, otherwise use original bare
        baseMascotId = outfit.clothedMascotId ?? outfit.originalMascotId;
      } else {
        return { success: false, error: "No mascot found. Please upload a base avatar first." };
      }

      // Get the base mascot URL (clothed or bare) - Reference Image 1
      const baseMascotUrl = await ctx.storage.getUrl(baseMascotId);
      if (!baseMascotUrl) {
        return { success: false, error: "Base mascot image not found" };
      }

      // Get the accessory image URL - Reference Image 2
      const accessoryImageUrl = await ctx.storage.getUrl(args.accessoryImageStorageId);
      if (!accessoryImageUrl) {
        return { success: false, error: "Accessory image not found" };
      }

      const fullPrompt = buildAccessoryPrompt(args.accessoryDescription, args.accessoryType);

      console.log("FLUX Kontext ACCESSORY generation:", {
        model: FLUX_KONTEXT_MODEL,
        prompt: fullPrompt,
        accessoryType: args.accessoryType,
        referenceImages: [baseMascotUrl, accessoryImageUrl],
        usingClothedBase: baseMascotId !== originalMascotId,
      });

      // Call Runware API
      const response = await fetch(RUNWARE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify([
          {
            taskType: "imageInference",
            taskUUID: crypto.randomUUID(),
            model: FLUX_KONTEXT_MODEL,
            positivePrompt: fullPrompt,
            referenceImages: [baseMascotUrl, accessoryImageUrl],
            width: 1024,
            height: 1024,
            steps: 30,
            numberResults: 1,
          },
        ]),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Runware API error:", errorText);
        return { success: false, error: `Failed to generate accessorized mascot: ${errorText}` };
      }

      const result = (await response.json()) as RunwareImageResponse;

      if (!result.data || result.data.length === 0) {
        return { success: false, error: "No image generated" };
      }

      // Download and store the generated image
      const imageResponse = await fetch(result.data[0].imageURL);
      if (!imageResponse.ok) {
        return { success: false, error: "Failed to download generated image" };
      }

      const imageBlob = await imageResponse.blob();
      const newStorageId = await ctx.storage.store(imageBlob);

      // Update mascot outfit - only updates accessory, keeps clothes
      await ctx.runMutation(internal.mascotHelpers.updateMascotOutfitAccessory, {
        email,
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
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

// Return type for reset mascot outfit action
type ResetOutfitResult = {
  success: boolean;
  storageId?: Id<"_storage">;
  imageUrl?: string;
  error?: string;
};

/**
 * Reset mascot outfit - removes all items and returns to original bare mascot
 */
export const resetMascotOutfit = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    storageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx): Promise<ResetOutfitResult> => {
    // Get authenticated user's email
    const email = await getAuthEmailForAction(ctx);
    if (!email) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      // Get current outfit to return original mascot URL
      const outfit: MascotOutfitResult | null = await ctx.runQuery(
        internal.mascotHelpers.getMascotOutfitByEmail,
        { email }
      );

      if (!outfit) {
        return { success: false, error: "No mascot outfit found" };
      }

      // Reset the outfit - clears clothes, accessory, and clothedMascotId
      await ctx.runMutation(internal.mascotHelpers.resetMascotOutfitInternal, {
        email,
      });

      // Get the original bare mascot URL
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
