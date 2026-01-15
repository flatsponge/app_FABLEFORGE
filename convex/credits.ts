import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUser, requireAuthUser } from "./authHelpers";
import {
  MAX_CREDITS_FREE,
  MAX_CREDITS_STORYMAX,
  computeCreditState,
  validateCreditAmount,
} from "./creditLogic";

/**
 * Get user credits with on-demand regeneration calculation
 */
export const getUserCredits = query({
  args: {},
  returns: v.union(
    v.object({
      balance: v.number(),
      cap: v.number(),
      timeToNextCredit: v.number(),
      isStoryMax: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;

    const credits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    const now = Date.now();
    const state = computeCreditState(credits, now);

    return {
      balance: state.balance,
      cap: state.cap,
      timeToNextCredit: state.timeToNextCredit,
      isStoryMax: state.isStoryMax,
    };
  },
});

/**
 * Initialize credits for a new user
 */
export const initializeCredits = mutation({
  args: {},
  returns: v.id("userCredits"),
  handler: async (ctx) => {
    const user = await requireAuthUser(ctx);

    // Check if already exists
    const existing = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (existing) return existing._id;

    return await ctx.db.insert("userCredits", {
      userId: user._id,
      balance: MAX_CREDITS_FREE,
      lastRegenTime: Date.now(),
      isStoryMax: false,
    });
  },
});

/**
 * Spend credits - returns success/failure
 */
export const spendCredits = mutation({
  args: { amount: v.number() },
  returns: v.object({ success: v.boolean(), error: v.optional(v.string()) }),
  handler: async (ctx, args) => {
    // Validate input
    const validation = validateCreditAmount(args.amount);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const user = await getAuthUser(ctx);
    if (!user) return { success: false, error: "Not authenticated" };

    let credits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    const now = Date.now();
    const state = computeCreditState(credits, now);

    // Initialize if doesn't exist
    if (!credits) {
      const id = await ctx.db.insert("userCredits", {
        userId: user._id,
        balance: state.cap,
        lastRegenTime: now,
        isStoryMax: false,
      });
      credits = await ctx.db.get(id);
    }

    if (!credits) return { success: false, error: "Failed to get credits" };

    if (state.balance < args.amount) {
      return { success: false, error: "Insufficient credits" };
    }

    // Update balance and reset regen timer
    await ctx.db.patch(credits._id, {
      balance: state.balance - args.amount,
      lastRegenTime: now,
    });

    return { success: true };
  },
});

/**
 * Add credits (from purchase) - allows overflow beyond cap
 */
export const addCredits = mutation({
  args: { amount: v.number() },
  returns: v.object({ success: v.boolean(), newBalance: v.number(), error: v.optional(v.string()) }),
  handler: async (ctx, args) => {
    // Validate input
    const validation = validateCreditAmount(args.amount);
    if (!validation.valid) {
      return { success: false, newBalance: 0, error: validation.error };
    }

    const user = await requireAuthUser(ctx);

    const credits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    const now = Date.now();
    const state = computeCreditState(credits, now);

    if (!credits) {
      // Initialize with purchase amount (can exceed cap)
      await ctx.db.insert("userCredits", {
        userId: user._id,
        balance: state.cap + args.amount,
        lastRegenTime: now,
        isStoryMax: false,
      });
      return { success: true, newBalance: state.cap + args.amount };
    }

    // Add purchase to regenerated balance (overflow allowed)
    const newBalance = state.balance + args.amount;

    await ctx.db.patch(credits._id, {
      balance: newBalance,
      lastRegenTime: now,
    });

    return { success: true, newBalance };
  },
});

/**
 * Activate StoryMax subscription
 */
export const activateStoryMax = mutation({
  args: { durationDays: v.number() },
  returns: v.object({ success: v.boolean(), error: v.optional(v.string()) }),
  handler: async (ctx, args) => {
    // Validate input
    if (!Number.isFinite(args.durationDays) || args.durationDays <= 0 || args.durationDays > 365) {
      return { success: false, error: "Invalid duration" };
    }

    const user = await requireAuthUser(ctx);

    const now = Date.now();
    const expiresAt = now + args.durationDays * 24 * 60 * 60 * 1000;

    const credits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!credits) {
      await ctx.db.insert("userCredits", {
        userId: user._id,
        balance: MAX_CREDITS_STORYMAX,
        lastRegenTime: now,
        isStoryMax: true,
        storyMaxExpiresAt: expiresAt,
      });
    } else {
      await ctx.db.patch(credits._id, {
        isStoryMax: true,
        storyMaxExpiresAt: expiresAt,
      });
    }
    return { success: true };
  },
});

/**
 * Grant paid entitlement and initialize credits.
 * Called when user completes paywall (for testing - will connect to Superwall later).
 * This is the ONLY place where credits should be initialized for new users.
 */
export const grantPaidEntitlement = mutation({
  args: {},
  returns: v.object({ success: v.boolean(), balance: v.number() }),
  handler: async (ctx) => {
    const user = await requireAuthUser(ctx);
    const now = Date.now();

    const credits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!credits) {
      // Initialize credits with full balance for new paid user
      await ctx.db.insert("userCredits", {
        userId: user._id,
        balance: MAX_CREDITS_FREE,
        lastRegenTime: now,
        isStoryMax: false,
        hasPaidEntitlement: true,
      });
      return { success: true, balance: MAX_CREDITS_FREE };
    }

    // Compute current balance with regeneration
    const state = computeCreditState(credits, now);

    // Update record: mark as paid entitled AND persist regenerated balance
    await ctx.db.patch(credits._id, {
      hasPaidEntitlement: true,
      balance: state.balance,
      lastRegenTime: now,
    });

    return { success: true, balance: state.balance };
  },
});

/**
 * Check if user has paid entitlement (for gating features)
 */
export const hasPaidEntitlement = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) return false;

    const credits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    return credits?.hasPaidEntitlement === true;
  },
});

/**
 * Internal mutation for cron to sync credits (paginated for scalability)
 * Processes up to 100 users per run - cron runs frequently enough to catch all
 * 
 * NOTE: With on-demand regen in all mutations/queries, this cron is optional.
 * It's kept for materializing balances for analytics or offline processing.
 */
export const syncAllCredits = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const now = Date.now();
    const BATCH_SIZE = 100;
    
    const creditsToProcess = await ctx.db
      .query("userCredits")
      .take(BATCH_SIZE);

    let updatedCount = 0;
    for (const credits of creditsToProcess) {
      const state = computeCreditState(credits, now);

      // Skip if at or above cap (no regen needed)
      if (credits.balance >= state.cap) continue;

      // Only update if there's actual regen to apply
      if (state.balance > credits.balance) {
        await ctx.db.patch(credits._id, {
          balance: state.balance,
          lastRegenTime: now,
        });
        updatedCount++;
      }
    }
    
    if (updatedCount > 0) {
      console.log(`Synced credits for ${updatedCount} users`);
    }
    return null;
  },
});
