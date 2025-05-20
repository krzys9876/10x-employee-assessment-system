import { defineMiddleware } from "astro:middleware";

import { supabaseClient } from "../db/supabase.client";

/**
 * @file Astro middleware for handling requests.
 * This middleware injects the Supabase client into the `context.locals` object,
 * making it available to API routes and server-side rendering in Astro components.
 * @module middleware/index
 * @see module:db/supabase.client
 */

/**
 * Astro middleware function that is called on every request.
 * It initializes the Supabase client and attaches it to `context.locals.supabase`.
 *
 * @function onRequest
 * @param {APIContext} context - The Astro API context, providing access to request details and local storage.
 * @param {function} next - A function to call to proceed to the next middleware or the actual page/API route.
 * @returns {Promise<Response | void>} A promise that resolves when the next middleware or route handler has completed.
 */
export const onRequest = defineMiddleware((context, next) => {
  context.locals.supabase = supabaseClient;
  return next();
});
