import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUser, requireAuthUser } from "./authHelpers";

// Credit system constants
const MAX_CREDITS_FREE = 150;
const MAX_CREDITS_STORYMAX = 300;
const REGEN_SECONDS_FREE = 1800; // 30 min
const REGEN_SECONDS_STORYMAX = 1200; // 20 min

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

    // Check if StoryMax expired
    const now = Date.now();
    const isStoryMax = credits?.isStoryMax && 
      (!credits.storyMaxExpiresAt || credits.storyMaxExpiresAt > now);
    
    const cap = isStoryMax ? MAX_CREDITS_STORYMAX : MAX_CREDITS_FREE;
    const regenSeconds = isStoryMax ? REGEN_SECONDS_STORYMAX : REGEN_SECONDS_FREE;

    if (!credits) {
      // No record yet - return defaults (will be initialized on first spend/add)
      return { balance: cap, cap, timeToNextCredit: 0, isStoryMax: false };
    }

    // Calculate regenerated credits since lastRegenTime
    const elapsed = Math.floor((now - credits.lastRegenTime) / 1000);
    const creditsToAdd = Math.floor(elapsed / regenSeconds);
    const newBalance = Math.min(credits.balance + creditsToAdd, cap);
    
    // Time until next credit (only if below cap)
    const timeToNextCredit = newBalance >= cap 
      ? 0 
      : regenSeconds - (elapsed % regenSeconds);

    return {
      balance: newBalance,
      cap,
      timeToNextCredit,
      isStoryMax: isStoryMax ?? false,
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
    const user = await getAuthUser(ctx);
    if (!user) return { success: false, error: "Not authenticated" };

    let credits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    const now = Date.now();
    const isStoryMax = credits?.isStoryMax && 
      (!credits.storyMaxExpiresAt || credits.storyMaxExpiresAt > now);
    const cap = isStoryMax ? MAX_CREDITS_STORYMAX : MAX_CREDITS_FREE;
    const regenSeconds = isStoryMax ? REGEN_SECONDS_STORYMAX : REGEN_SECONDS_FREE;

    // Initialize if doesn't exist
    if (!credits) {
      const id = await ctx.db.insert("userCredits", {
        userId: user._id,
        balance: cap,
        lastRegenTime: now,
        isStoryMax: false,
      });
      credits = await ctx.db.get(id);
    }

    if (!credits) return { success: false, error: "Failed to get credits" };

    // Calculate current balance with regen
    const elapsed = Math.floor((now - credits.lastRegenTime) / 1000);
    const creditsToAdd = Math.floor(elapsed / regenSeconds);
    const currentBalance = Math.min(credits.balance + creditsToAdd, cap);

    if (currentBalance < args.amount) {
      return { success: false, error: "Insufficient credits" };
    }

    // Update balance and reset regen timer
    await ctx.db.patch(credits._id, {
      balance: currentBalance - args.amount,
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
  returns: v.object({ success: v.boolean(), newBalance: v.number() }),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);

    let credits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    const now = Date.now();
    const isStoryMax = credits?.isStoryMax && 
      (!credits.storyMaxExpiresAt || credits.storyMaxExpiresAt > now);
    const cap = isStoryMax ? MAX_CREDITS_STORYMAX : MAX_CREDITS_FREE;
    const regenSeconds = isStoryMax ? REGEN_SECONDS_STORYMAX : REGEN_SECONDS_FREE;

    if (!credits) {
      // Initialize with purchase amount (can exceed cap)
      await ctx.db.insert("userCredits", {
        userId: user._id,
        balance: cap + args.amount,
        lastRegenTime: now,
        isStoryMax: false,
      });
      return { success: true, newBalance: cap + args.amount };
    }

    // Calculate current balance with regen (capped), then add purchase (overflow allowed)
    const elapsed = Math.floor((now - credits.lastRegenTime) / 1000);
    const creditsToAdd = Math.floor(elapsed / regenSeconds);
    const regenBalance = Math.min(credits.balance + creditsToAdd, cap);
    const newBalance = regenBalance + args.amount; // No cap on purchases

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
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireAuthUser(ctx);

    const now = Date.now();
    const expiresAt = now + args.durationDays * 24 * 60 * 60 * 1000;

    let credits = await ctx.db
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
    return null;
  },
});

/**
 * Internal mutation for cron to sync credits (paginated for scalability)
 * Processes up to 100 users per run - cron runs frequently enough to catch all
 */
export const syncAllCredits = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const now = Date.now();
    const BATCH_SIZE = 100;
    
    // Only fetch users who might need regen (below cap and enough time elapsed)
    // Process in smaller batches for better performance
    const creditsToProcess = await ctx.db
      .query("userCredits")
      .take(BATCH_SIZE);

    let updatedCount = 0;
    for (const credits of creditsToProcess) {
      const isStoryMax = credits.isStoryMax && 
        (!credits.storyMaxExpiresAt || credits.storyMaxExpiresAt > now);
      const cap = isStoryMax ? MAX_CREDITS_STORYMAX : MAX_CREDITS_FREE;
      const regenSeconds = isStoryMax ? REGEN_SECONDS_STORYMAX : REGEN_SECONDS_FREE;

      // Skip if at or above cap
      if (credits.balance >= cap) continue;

      const elapsed = Math.floor((now - credits.lastRegenTime) / 1000);
      const creditsToAdd = Math.floor(elapsed / regenSeconds);
      
      if (creditsToAdd > 0) {
        const newBalance = Math.min(credits.balance + creditsToAdd, cap);
        await ctx.db.patch(credits._id, {
          balance: newBalance,
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
