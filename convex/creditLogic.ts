/**
 * Centralized credit system logic.
 * Single source of truth for credit constants and calculations.
 */

// Credit system constants
export const MAX_CREDITS_FREE = 150;
export const MAX_CREDITS_STORYMAX = 300;
export const REGEN_SECONDS_FREE = 1800; // 30 min
export const REGEN_SECONDS_STORYMAX = 1200; // 20 min

// Story generation costs
export const STORY_BASE_COST = 5;
export const LOCATION_COST = 2;
export const CHARACTER_COST = 2;
export const VOICE_COST = 1;

export interface CreditDoc {
  balance: number;
  lastRegenTime: number;
  isStoryMax?: boolean;
  storyMaxExpiresAt?: number | null;
  hasPaidEntitlement?: boolean;
}

export interface CreditState {
  isStoryMax: boolean;
  cap: number;
  regenSeconds: number;
  balance: number;
  timeToNextCredit: number;
}

/**
 * Compute the current credit state including regeneration.
 * This is the single source of truth for credit calculations.
 */
export function computeCreditState(
  credits: CreditDoc | null,
  now: number
): CreditState {
  const isStoryMax =
    !!credits?.isStoryMax &&
    (!credits.storyMaxExpiresAt || credits.storyMaxExpiresAt > now);

  const cap = isStoryMax ? MAX_CREDITS_STORYMAX : MAX_CREDITS_FREE;
  const regenSeconds = isStoryMax ? REGEN_SECONDS_STORYMAX : REGEN_SECONDS_FREE;

  if (!credits) {
    return {
      isStoryMax,
      cap,
      regenSeconds,
      balance: cap,
      timeToNextCredit: 0,
    };
  }

  const elapsed = Math.floor((now - credits.lastRegenTime) / 1000);
  const creditsToAdd = Math.floor(elapsed / regenSeconds);
  const balance = Math.min(credits.balance + creditsToAdd, cap);

  const timeToNextCredit =
    balance >= cap ? 0 : regenSeconds - (elapsed % regenSeconds);

  return { isStoryMax, cap, regenSeconds, balance, timeToNextCredit };
}

/**
 * Compute story generation cost server-side.
 * Never trust client-supplied costs.
 */
export function computeStoryCost(args: {
  hasLocation?: boolean;
  hasCharacter?: boolean;
  hasVoice?: boolean;
}): number {
  let cost = STORY_BASE_COST;
  if (args.hasLocation) cost += LOCATION_COST;
  if (args.hasCharacter) cost += CHARACTER_COST;
  if (args.hasVoice) cost += VOICE_COST;
  return cost;
}

/**
 * Validate credit amount for mutations.
 */
export function validateCreditAmount(amount: number): {
  valid: boolean;
  error?: string;
} {
  if (!Number.isFinite(amount)) {
    return { valid: false, error: "Invalid amount" };
  }
  if (amount <= 0) {
    return { valid: false, error: "Amount must be positive" };
  }
  if (amount > 10000) {
    return { valid: false, error: "Amount exceeds maximum" };
  }
  return { valid: true };
}
