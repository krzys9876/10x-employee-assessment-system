import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../db/database.types";
import { requireAuth, type AuthResult } from "./auth-utils";

/**
 * @file API utility functions.
 * This module provides helper functions for creating standardized API responses and handling user authentication in API routes.
 * @module lib/api-utils
 * @see module:lib/auth-utils
 */

/**
 * Creates a standardized JSON API response.
 *
 * @template T The type of the data to be included in the response body.
 * @function createApiResponse
 * @param {T} data - The data to be sent in the response body. Will be JSON.stringified.
 * @param {number} [status=200] - The HTTP status code for the response.
 * @returns {Response} A `Response` object with a JSON body and appropriate headers.
 * @example
 * ```ts
 * const user = { id: 1, name: "John Doe" };
 * return createApiResponse(user, 200);
 * ```
 */
export function createApiResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Creates a standardized JSON error response.
 *
 * @function createErrorResponse
 * @param {string} message - The error message to be included in the response body.
 * @param {number} [status=400] - The HTTP status code for the error response.
 * @param {unknown} [details] - Optional additional details about the error.
 * @returns {Response} A `Response` object with a JSON error body.
 * @example
 * ```ts
 * return createErrorResponse("Invalid input", 422, { field: "email" });
 * ```
 */
export function createErrorResponse(message: string, status = 400, details?: unknown): Response {
  const responseBody: Record<string, unknown> = { error: message };
  if (details) responseBody.details = details;
  return createApiResponse(responseBody, status);
}

/**
 * Represents the result of authenticating a user in an API context.
 * @interface AuthenticatedUserResult
 * @extends AuthResult
 * @property {boolean} isAuthenticated - True if the user is authenticated, false otherwise.
 * @property {Response | null} error - A `Response` object if authentication fails, otherwise null. This is different from `AuthResult.error` which is an error object.
 */
interface AuthenticatedUserResult extends Omit<AuthResult, "error"> {
  isAuthenticated: boolean;
  error: Response | null;
}

/**
 * Authenticates a user for an API request using Supabase.
 * It leverages the `requireAuth` function and wraps the result in a way suitable for API route handlers,
 * providing either the authenticated user or a pre-formatted error `Response`.
 *
 * @async
 * @function authenticateUser
 * @param {SupabaseClient<Database>} supabase - The Supabase client instance.
 * @returns {Promise<AuthenticatedUserResult>} A promise that resolves to an `AuthenticatedUserResult` object.
 * If authenticated, `isAuthenticated` is true, `user` contains the user object, and `error` is null.
 * If not authenticated, `isAuthenticated` is false, `user` is null, and `error` contains a `Response` object
 * with the appropriate error message and status code.
 * @see module:lib/auth-utils~requireAuth
 * @example
 * ```ts
 * // In an Astro API route (e.g., src/pages/api/protected.ts)
 * export async function GET({ locals }: APIContext) {
 *   const { supabase } = locals;
 *   const { isAuthenticated, user, error } = await authenticateUser(supabase);
 *
 *   if (!isAuthenticated || !user) {
 *     return error; // This is a Response object
 *   }
 *
 *   // User is authenticated, proceed to handle the API request
 *   return createApiResponse({ message: `Hello, ${user.email}` });
 * }
 * ```
 */
export async function authenticateUser(supabase: SupabaseClient<Database>): Promise<AuthenticatedUserResult> {
  const { user, error } = await requireAuth(supabase);
  if (error || !user) {
    return {
      isAuthenticated: false,
      error: createErrorResponse(error?.message || "Użytkownik niezalogowany", error?.status || 401),
      user: null,
    };
  }
  return { isAuthenticated: true, error: null, user };
}
