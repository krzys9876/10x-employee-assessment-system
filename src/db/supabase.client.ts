import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

/**
 * @file Supabase client configuration and instantiation.
 * This module initializes and exports a singleton Supabase client instance for interacting with the Supabase backend.
 * It reads the Supabase URL and anonymous key from environment variables.
 * @module db/supabase.client
 * @see module:db/database.types
 */

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

/**
 * The Supabase client instance, typed with the project's database schema.
 * This client is used throughout the application to interact with Supabase services (Auth, Database, Storage, etc.).
 * It is configured with the Supabase URL and anonymous key retrieved from environment variables.
 *
 * Ensure that `SUPABASE_URL` and `SUPABASE_KEY` are correctly set in your environment variables
 * (e.g., in a `.env` file).
 *
 * @constant {SupabaseClient<Database>} supabaseClient
 * @example
 * ```ts
 * // Example usage in a server-side component or API route
 * import { supabaseClient } from "../db/supabase.client";
 *
 * async function fetchData() {
 *   const { data, error } = await supabaseClient.from("users").select("*");
 *   if (error) console.error("Error fetching users:", error);
 *   else console.log("Users:", data);
 * }
 * ```
 */
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
