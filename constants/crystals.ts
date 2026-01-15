/**
 * Crystal System Constants
 * Central configuration for the crystal currency/energy system
 * 
 * NOTE: Server-side uses convex/creditLogic.ts as source of truth.
 * These client constants should match but are for display only.
 */

/** Maximum number of crystals a free user can hold */
export const MAX_CRYSTALS = 150;

/** Time in seconds for one crystal to regenerate (30 minutes) */
export const REGEN_TIME_SECONDS = 1800;

/** Maximum crystals for StoryMAX subscribers */
export const MAX_CRYSTALS_PREMIUM = 300;

/** Regen time for StoryMAX subscribers (20 minutes) */
export const REGEN_TIME_SECONDS_PREMIUM = 1200;

/** Story generation costs (must match convex/creditLogic.ts) */
export const STORY_BASE_COST = 5;
export const LOCATION_COST = 2;
export const CHARACTER_COST = 2;
export const VOICE_COST = 1;

/** Cost tiers for crystal purchases */
export const CRYSTAL_PURCHASE_OPTIONS = {
  small: { amount: 100, price: '$1.99' },
  large: { amount: 500, price: '$4.99' },
} as const;

/** StoryMAX subscription pricing */
export const STORYMAX_PRICE = '$9.99/mo';

/** Instant crystal boost for StoryMAX subscribers */
export const STORYMAX_BOOST = 1000;

/**
 * Calculate story generation cost (client-side for display).
 * Server computes actual cost - this is only for UI.
 */
export function computeStoryCostClient(args: {
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
