/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actionAuthHelpers from "../actionAuthHelpers.js";
import type * as aiProviders from "../aiProviders.js";
import type * as auth from "../auth.js";
import type * as authHelpers from "../authHelpers.js";
import type * as credits from "../credits.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as imageGeneration from "../imageGeneration.js";
import type * as mascotGeneration from "../mascotGeneration.js";
import type * as mascotGenerationActions from "../mascotGenerationActions.js";
import type * as mascotHelpers from "../mascotHelpers.js";
import type * as onboarding from "../onboarding.js";
import type * as storyGeneration from "../storyGeneration.js";
import type * as storyGenerationActions from "../storyGenerationActions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  actionAuthHelpers: typeof actionAuthHelpers;
  aiProviders: typeof aiProviders;
  auth: typeof auth;
  authHelpers: typeof authHelpers;
  credits: typeof credits;
  crons: typeof crons;
  http: typeof http;
  imageGeneration: typeof imageGeneration;
  mascotGeneration: typeof mascotGeneration;
  mascotGenerationActions: typeof mascotGenerationActions;
  mascotHelpers: typeof mascotHelpers;
  onboarding: typeof onboarding;
  storyGeneration: typeof storyGeneration;
  storyGenerationActions: typeof storyGenerationActions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
