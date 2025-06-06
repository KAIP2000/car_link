/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as bookingRequests from "../bookingRequests.js";
import type * as drivers from "../drivers.js";
import type * as feedback from "../feedback.js";
import type * as http from "../http.js";
import type * as storage from "../storage.js";
import type * as unavailablePeriods from "../unavailablePeriods.js";
import type * as users from "../users.js";
import type * as vehicles from "../vehicles.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  bookingRequests: typeof bookingRequests;
  drivers: typeof drivers;
  feedback: typeof feedback;
  http: typeof http;
  storage: typeof storage;
  unavailablePeriods: typeof unavailablePeriods;
  users: typeof users;
  vehicles: typeof vehicles;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
