import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "../db/database.types";

/**
 * Represents the result of an authentication check.
 * @interface AuthResult
 * @property {User | null} user - The authenticated user object, or null if not authenticated.
 * @property {object} [error] - An error object if authentication fails.
 * @property {number} error.status - The HTTP status code of the error.
 * @property {string} error.message - A descriptive error message.
 */
export interface AuthResult {
  user: User | null;
  error?: {
    status: number;
    message: string;
  };
}

/**
 * Checks if a user is authenticated by verifying the current session with Supabase.
 * This function is typically used in server-side code (e.g., Astro components, API routes)
 * to protect routes or fetch user-specific data.
 *
 * @async
 * @function requireAuth
 * @param {SupabaseClient<Database>} supabase - The Supabase client instance, typed with the project's database schema.
 * @returns {Promise<AuthResult>} A promise that resolves to an `AuthResult` object.
 * If authentication is successful, `AuthResult.user` will contain the user object.
 * If authentication fails (e.g., no active session, error fetching user), `AuthResult.error` will be populated.
 * @module lib/auth-utils
 * @see {@link AuthResult}
 * @example
 * ```ts
 * // In an Astro component's frontmatter
 * const { supabase } = Astro.locals;
 * const { user, error } = await requireAuth(supabase);
 * if (error || !user) {
 *   return Astro.redirect("/login");
 * }
 * // User is authenticated, proceed with rendering the page
 * ```
 */
export async function requireAuth(supabase: SupabaseClient<Database>): Promise<AuthResult> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      error: {
        status: 401,
        message: "Unauthorized: User not logged in or insufficient permissions",
      },
    };
  }

  return {
    user,
  };
}
