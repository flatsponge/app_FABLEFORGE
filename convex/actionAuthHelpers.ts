"use node";

import { ActionCtx } from "./_generated/server";

// ============================================================================
// ACTION AUTH HELPERS
// ============================================================================
// These helpers are specifically for Convex Actions (with "use node").
//
// IMPORTANT: getAuthUserId from @convex-dev/auth DOES NOT work in Node.js actions
// because actions don't have direct database access. Instead, we must:
// 1. Get the identity from ctx.auth.getUserIdentity()
// 2. Parse the userId from identity.subject (format: "userId|sessionId")
// 3. Use ctx.runQuery to fetch user data from the database
//
// For queries and mutations, use the helpers in authHelpers.ts instead.
// ============================================================================

/**
 * Parse the auth subject from @convex-dev/auth JWT.
 *
 * With @convex-dev/auth, the JWT subject is formatted as "userId|sessionId".
 * This function safely extracts both parts.
 *
 * @param subject - The identity.subject string from getUserIdentity()
 * @returns Object containing userId and sessionId (sessionId may be null for other auth providers)
 */
export function parseAuthSubject(subject: string): {
  userId: string;
  sessionId: string | null;
} {
  if (subject.includes("|")) {
    const parts = subject.split("|");
    return {
      userId: parts[0],
      sessionId: parts[1] ?? null,
    };
  }
  // Fallback for other auth providers that don't use the pipe format
  return { userId: subject, sessionId: null };
}

/**
 * Get the authenticated user's ID for actions.
 *
 * This is the action-compatible equivalent of getAuthUserId from @convex-dev/auth.
 * It properly handles the "userId|sessionId" format in identity.subject.
 *
 * @param ctx - The action context
 * @returns The user ID string, or null if not authenticated
 */
export async function getAuthUserIdForAction(
  ctx: ActionCtx
): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) {
    return null;
  }

  const { userId } = parseAuthSubject(identity.subject);
  return userId;
}

/**
 * Require authentication for an action - throws if not authenticated.
 *
 * @param ctx - The action context
 * @returns The user ID string
 * @throws Error if not authenticated
 */
export async function requireAuthForAction(ctx: ActionCtx): Promise<string> {
  const userId = await getAuthUserIdForAction(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}

/**
 * Log authentication debug information for troubleshooting.
 *
 * @param ctx - The action context
 * @param context - Additional context string for the log
 * @param details - Optional additional details to log
 */
export async function logAuthDebugForAction(
  ctx: ActionCtx,
  context: string,
  details?: Record<string, unknown>
): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  console.error(`[ActionAuth] ${context}`, {
    hasIdentity: !!identity,
    subject: identity?.subject,
    email: identity?.email,
    tokenIdentifier: identity?.tokenIdentifier,
    ...details,
  });
}
