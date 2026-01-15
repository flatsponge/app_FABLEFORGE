import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Create a new wish from the child's wishing well
 */
export const createWish = mutation({
  args: {
    text: v.string(),
  },
  returns: v.id("wishes"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const wishId = await ctx.db.insert("wishes", {
      userId,
      text: args.text.trim(),
      type: "text",
      isNew: true,
      status: "active",
      createdAt: Date.now(),
    });

    return wishId;
  },
});

/**
 * Get active wishes for the current user, ordered by creation time (newest first)
 * Only returns wishes with status "active" (hides used and dismissed)
 */
export const getUserWishes = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("wishes"),
      _creationTime: v.number(),
      text: v.string(),
      type: v.literal("text"),
      isNew: v.boolean(),
      status: v.union(v.literal("active"), v.literal("used"), v.literal("dismissed")),
      usedInStoryId: v.optional(v.id("books")),
      usedAt: v.optional(v.number()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Only fetch active wishes (not used or dismissed)
    const wishes = await ctx.db
      .query("wishes")
      .withIndex("by_user_and_status", (q) => q.eq("userId", userId).eq("status", "active"))
      .order("desc")
      .collect();

    return wishes;
  },
});

/**
 * Get count of new (unread) wishes
 */
export const getNewWishCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return 0;
    }

    const newWishes = await ctx.db
      .query("wishes")
      .withIndex("by_user_and_new", (q) => q.eq("userId", userId).eq("isNew", true))
      .collect();

    return newWishes.length;
  },
});

/**
 * Mark all wishes as read (no longer new)
 */
export const markWishesAsRead = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const newWishes = await ctx.db
      .query("wishes")
      .withIndex("by_user_and_new", (q) => q.eq("userId", userId).eq("isNew", true))
      .collect();

    for (const wish of newWishes) {
      await ctx.db.patch(wish._id, { isNew: false });
    }

    return null;
  },
});

/**
 * Mark a wish as used in a story (hides it from the list)
 */
export const markWishAsUsed = mutation({
  args: {
    wishId: v.id("wishes"),
    bookId: v.optional(v.id("books")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const wish = await ctx.db.get(args.wishId);
    if (!wish || wish.userId !== userId) {
      throw new Error("Wish not found");
    }

    await ctx.db.patch(args.wishId, {
      status: "used",
      usedInStoryId: args.bookId,
      usedAt: Date.now(),
      isNew: false,
    });

    return null;
  },
});

/**
 * Dismiss a wish (hides it from the list)
 */
export const dismissWish = mutation({
  args: {
    wishId: v.id("wishes"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const wish = await ctx.db.get(args.wishId);
    if (!wish || wish.userId !== userId) {
      throw new Error("Wish not found");
    }

    await ctx.db.patch(args.wishId, {
      status: "dismissed",
      dismissedAt: Date.now(),
      isNew: false,
    });

    return null;
  },
});

/**
 * Delete a wish
 */
export const deleteWish = mutation({
  args: {
    wishId: v.id("wishes"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const wish = await ctx.db.get(args.wishId);
    if (!wish || wish.userId !== userId) {
      throw new Error("Wish not found");
    }

    await ctx.db.delete(args.wishId);

    return null;
  },
});
