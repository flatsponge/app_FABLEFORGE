import { QueryCtx, MutationCtx, internalQuery } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { getAuthUserId as getConvexAuthUserId } from "@convex-dev/auth/server";

/**
 * Get the authenticated user from the current context.
 * 
 * Uses @convex-dev/auth's getAuthUserId to properly resolve the user ID
 * from the authentication session.
 * 
 * @returns The user document or null if not authenticated/not found
 */
export async function getAuthUser(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users"> | null> {
  // Use @convex-dev/auth's proper method to get the user ID
  const userId = await getConvexAuthUserId(ctx);
  if (!userId) {
    return null;
  }

  // Fetch the full user document
  const user = await ctx.db.get(userId);
  if (user) {
    return user;
  }

  // Fallback: lookup by email (for edge cases)
  const identity = await ctx.auth.getUserIdentity();
  if (identity?.email) {
    const userByEmail = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .unique();
    if (userByEmail) {
      return userByEmail;
    }
  }

  return null;
}

/**
 * Require an authenticated user - throws if not found.
 * Use this in mutations that must have a valid user.
 * 
 * @throws Error if user is not authenticated or not found
 */
export async function requireAuthUser(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users">> {
  // Use @convex-dev/auth's proper method to get the user ID
  const userId = await getConvexAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db.get(userId);
  if (user) {
    return user;
  }

  // Fallback: lookup by email (for edge cases)
  const identity = await ctx.auth.getUserIdentity();
  if (identity?.email) {
    const userByEmail = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .unique();
    if (userByEmail) {
      return userByEmail;
    }
  }

  // Log helpful debug info if still not found
  console.error("[Auth] User not found:", {
    userId,
    email: identity?.email,
  });
  throw new Error(
    `User not found. UserId: ${userId}, Email: ${identity?.email}`
  );
}

/**
 * Get just the user ID from the auth context without fetching the full document.
 * Useful when you only need the ID for a foreign key reference.
 * 
 * Uses @convex-dev/auth's getAuthUserId for proper session resolution.
 */
export async function getAuthUserId(
  ctx: QueryCtx | MutationCtx
): Promise<Id<"users"> | null> {
  return await getConvexAuthUserId(ctx);
}

// ============================================================================
// INTERNAL QUERIES FOR ACTIONS
// ============================================================================
// Actions don't have direct database access and receive only JWT tokens.
// With @convex-dev/auth, the JWT contains `subject` (user ID) but NOT the email.
// These internal queries allow actions to fetch user data from the database.
// ============================================================================

/**
 * Internal query for actions to get the authenticated user's email.
 * 
 * @param userId - The user ID from identity.subject
 * @returns The user's email or null if not found
 */
export const getUserEmailById = internalQuery({
  args: { userId: v.string() },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    try {
      // The userId from identity.subject is the user's _id as a string
      const user = await ctx.db.get(args.userId as Id<"users">);
      return user?.email ?? null;
    } catch {
      console.error("[Auth] Failed to get user by ID:", args.userId);
      return null;
    }
  },
});

/**
 * Internal query for actions to get the full user document.
 * Use this when you need more than just the email.
 * 
 * @param userId - The user ID from identity.subject
 * @returns The user document or null if not found
 */
export const getUserById = internalQuery({
  args: { userId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      email: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db.get(args.userId as Id<"users">);
      if (!user) return null;
      return {
        _id: user._id,
        _creationTime: user._creationTime,
        email: user.email,
      };
    } catch {
      console.error("[Auth] Failed to get user by ID:", args.userId);
      return null;
    }
  },
});
