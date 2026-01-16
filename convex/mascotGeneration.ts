import { v } from "convex/values";
import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAuthUser, getAuthUser } from "./authHelpers";

export const queueMascotJob = mutation({
  args: {
    generationType: v.union(v.literal("text"), v.literal("image")),
    description: v.optional(v.string()),
    sourceImageId: v.optional(v.id("_storage")),
  },
  returns: v.object({
    success: v.boolean(),
    jobId: v.optional(v.id("mascotJobs")),
    existingJobId: v.optional(v.id("mascotJobs")),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);
    const userId = user._id;

    // Use by_user_and_status index instead of filter for better performance
    const existingComplete = await ctx.db
      .query("mascotJobs")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", userId).eq("status", "complete")
      )
      .first();

    if (existingComplete) {
      return {
        success: true,
        existingJobId: existingComplete._id,
        error: "You already have a generated mascot",
      };
    }

    // Check for queued jobs using index
    const existingQueued = await ctx.db
      .query("mascotJobs")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", userId).eq("status", "queued")
      )
      .first();

    if (existingQueued) {
      return {
        success: true,
        jobId: existingQueued._id,
      };
    }

    // Check for generating jobs using index
    const existingGenerating = await ctx.db
      .query("mascotJobs")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", userId).eq("status", "generating")
      )
      .first();

    if (existingGenerating) {
      return {
        success: true,
        jobId: existingGenerating._id,
      };
    }

    const jobId = await ctx.db.insert("mascotJobs", {
      userId: userId,
      status: "queued",
      progress: 0,
      generationType: args.generationType,
      description: args.description,
      sourceImageId: args.sourceImageId,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.mascotGenerationActions.processMascotJob, {
      jobId,
    });

    return { success: true, jobId };
  },
});

export const getMascotJob = query({
  args: { jobId: v.id("mascotJobs") },
  returns: v.union(
    v.object({
      _id: v.id("mascotJobs"),
      status: v.union(
        v.literal("queued"),
        v.literal("generating"),
        v.literal("complete"),
        v.literal("failed")
      ),
      progress: v.number(),
      error: v.optional(v.string()),
      resultStorageId: v.optional(v.id("_storage")),
      resultImageUrl: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const job = await ctx.db.get(args.jobId);
    if (!job) return null;

    // Ownership check: only return job if it belongs to the authenticated user
    if (user && job.userId !== user._id) {
      return null;
    }

    return {
      _id: job._id,
      status: job.status,
      progress: job.progress,
      error: job.error,
      resultStorageId: job.resultStorageId,
      resultImageUrl: job.resultImageUrl,
    };
  },
});

export const getMascotJobByUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("mascotJobs"),
      status: v.union(
        v.literal("queued"),
        v.literal("generating"),
        v.literal("complete"),
        v.literal("failed")
      ),
      progress: v.number(),
      error: v.optional(v.string()),
      resultStorageId: v.optional(v.id("_storage")),
      resultImageUrl: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    const job = await ctx.db
      .query("mascotJobs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    if (!job) return null;

    return {
      _id: job._id,
      status: job.status,
      progress: job.progress,
      error: job.error,
      resultStorageId: job.resultStorageId,
      resultImageUrl: job.resultImageUrl,
    };
  },
});

export const updateMascotJobProgress = internalMutation({
  args: {
    jobId: v.id("mascotJobs"),
    status: v.optional(
      v.union(
        v.literal("queued"),
        v.literal("generating"),
        v.literal("complete"),
        v.literal("failed")
      )
    ),
    progress: v.optional(v.number()),
    error: v.optional(v.string()),
    resultStorageId: v.optional(v.id("_storage")),
    resultImageUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {};

    if (args.status !== undefined) {
      updates.status = args.status;
      if (args.status === "generating") {
        updates.startedAt = Date.now();
      } else if (args.status === "complete" || args.status === "failed") {
        updates.finishedAt = Date.now();
      }
    }

    if (args.progress !== undefined) updates.progress = args.progress;
    if (args.error !== undefined) updates.error = args.error;
    if (args.resultStorageId !== undefined) updates.resultStorageId = args.resultStorageId;
    if (args.resultImageUrl !== undefined) updates.resultImageUrl = args.resultImageUrl;

    await ctx.db.patch(args.jobId, updates);
    return null;
  },
});

export const getJobInternal = internalQuery({
  args: { jobId: v.id("mascotJobs") },
  returns: v.union(
    v.object({
      _id: v.id("mascotJobs"),
      userId: v.id("users"),
      generationType: v.union(v.literal("text"), v.literal("image")),
      description: v.optional(v.string()),
      sourceImageId: v.optional(v.id("_storage")),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) return null;

    return {
      _id: job._id,
      userId: job.userId,
      generationType: job.generationType,
      description: job.description,
      sourceImageId: job.sourceImageId,
    };
  },
});

/**
 * Idempotent claim mutation for mascot job processing.
 * Returns job data only if successfully claimed (status was "queued").
 * This prevents duplicate processing from scheduler retries.
 */
export const claimMascotJob = internalMutation({
  args: { jobId: v.id("mascotJobs") },
  returns: v.union(
    v.object({
      claimed: v.literal(true),
      userId: v.id("users"),
      generationType: v.union(v.literal("text"), v.literal("image")),
      description: v.optional(v.string()),
      sourceImageId: v.optional(v.id("_storage")),
    }),
    v.object({
      claimed: v.literal(false),
    })
  ),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      return { claimed: false as const };
    }

    // Only claim if job is in queued state (idempotent)
    if (job.status !== "queued") {
      return { claimed: false as const };
    }

    // Atomically transition to generating state
    await ctx.db.patch(args.jobId, {
      status: "generating",
      startedAt: Date.now(),
      progress: 10,
    });

    return {
      claimed: true as const,
      userId: job.userId,
      generationType: job.generationType,
      description: job.description,
      sourceImageId: job.sourceImageId,
    };
  },
});

export const retryMascotJob = mutation({
  args: { jobId: v.id("mascotJobs") },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      return { success: false, error: "Job not found" };
    }

    // Ownership check: only allow retry if job belongs to the authenticated user
    if (job.userId !== user._id) {
      return { success: false, error: "Job not found" };
    }

    if (job.status !== "failed") {
      return { success: false, error: "Only failed jobs can be retried" };
    }

    await ctx.db.patch(args.jobId, {
      status: "queued",
      progress: 0,
      error: undefined,
      startedAt: undefined,
      finishedAt: undefined,
    });

    await ctx.scheduler.runAfter(0, internal.mascotGenerationActions.processMascotJob, {
      jobId: args.jobId,
    });

    return { success: true };
  },
});
