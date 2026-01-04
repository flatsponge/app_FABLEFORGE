/**
 * Crystal System Constants
 * Central configuration for the crystal currency/energy system
 */

/** Maximum number of crystals a free user can hold */
export const MAX_CRYSTALS = 160;

/** Time in seconds for one crystal to regenerate */
export const REGEN_TIME_SECONDS = 1800; // 30 minutes

/** Maximum crystals for StoryMAX subscribers */
export const MAX_CRYSTALS_PREMIUM = 320;

/** Regen time for StoryMAX subscribers (15 minutes) */
export const REGEN_TIME_SECONDS_PREMIUM = 900;

/** Cost tiers for crystal purchases */
export const CRYSTAL_PURCHASE_OPTIONS = {
    small: { amount: 100, price: '$1.99' },
    large: { amount: 500, price: '$4.99' },
} as const;

/** StoryMAX subscription pricing */
export const STORYMAX_PRICE = '$9.99/mo';

/** Instant crystal boost for StoryMAX subscribers */
export const STORYMAX_BOOST = 1000;
