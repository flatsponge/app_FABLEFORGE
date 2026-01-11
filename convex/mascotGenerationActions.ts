"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { generateImageUrl, getImageApiKey } from "./aiProviders";

const MASCOT_STYLE_PROMPT = `Simple cute humanoid chibi mascot for a children's moral-values storybook app. Anthropomorphic (standing upright on two legs), full-body, centered, facing slightly 3/4. Rounded proportions, big gentle eyes, soft smile, small blush cheeks. Hands visible (soft mitten-like hooves/paws). Very simple shapes, minimal linework, flat colors only, no gradients, no texture, no complex highlights. Pure white background (#FFFFFF). NO shadows of any kind. No scene, no props, no text, no watermark, no border.`;

function buildMascotPrompt(userDescription: string): string {
  return `${userDescription}. ${MASCOT_STYLE_PROMPT}`;
}

export const processMascotJob = internalAction({
  args: { jobId: v.id("mascotJobs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const job = await ctx.runQuery(internal.mascotGeneration.getJobInternal, {
      jobId: args.jobId,
    });

    if (!job) {
      console.error("Job not found:", args.jobId);
      return null;
    }

    await ctx.runMutation(internal.mascotGeneration.updateMascotJobProgress, {
      jobId: args.jobId,
      status: "generating",
      progress: 10,
    });

    const apiKey = getImageApiKey();
    if (!apiKey) {
      await ctx.runMutation(internal.mascotGeneration.updateMascotJobProgress, {
        jobId: args.jobId,
        status: "failed",
        error: "Image generation service not configured",
      });
      return null;
    }

    try {
      let imageUrl: string;

      if (job.generationType === "text") {
        const fullPrompt = buildMascotPrompt(job.description || "a friendly animal");

        await ctx.runMutation(internal.mascotGeneration.updateMascotJobProgress, {
          jobId: args.jobId,
          progress: 30,
        });

        imageUrl = await generateImageUrl(apiKey, {
          positivePrompt: fullPrompt,
        });
      } else {
        if (!job.sourceImageId) {
          throw new Error("No source image provided");
        }

        const sourceUrl = await ctx.storage.getUrl(job.sourceImageId);
        if (!sourceUrl) {
          throw new Error("Source image not found");
        }

        await ctx.runMutation(internal.mascotGeneration.updateMascotJobProgress, {
          jobId: args.jobId,
          progress: 30,
        });

        const transformPrompt = `Transform this into: ${MASCOT_STYLE_PROMPT} Keep the character's personality and colors.`;

        imageUrl = await generateImageUrl(apiKey, {
          positivePrompt: transformPrompt,
          referenceImages: [sourceUrl],
        });
      }

      await ctx.runMutation(internal.mascotGeneration.updateMascotJobProgress, {
        jobId: args.jobId,
        progress: 70,
      });

      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error("Failed to download generated image");
      }

      const imageBlob = await imageResponse.blob();
      const storageId = await ctx.storage.store(imageBlob);

      const storedUrl = await ctx.storage.getUrl(storageId);

      await ctx.runMutation(internal.mascotGeneration.updateMascotJobProgress, {
        jobId: args.jobId,
        status: "complete",
        progress: 100,
        resultStorageId: storageId,
        resultImageUrl: storedUrl ?? undefined,
      });

      await ctx.runMutation(internal.mascotHelpers.recordGeneration, {
        userId: job.userId,
        storageId,
        generationType: job.generationType as "text" | "image",
        prompt: job.description,
      });
    } catch (error) {
      console.error("Mascot generation error:", error);
      await ctx.runMutation(internal.mascotGeneration.updateMascotJobProgress, {
        jobId: args.jobId,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return null;
  },
});
