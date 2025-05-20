/// <reference types="astro/client" />

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./db/database.types";

/**
 * @file Type declarations for environment variables and Astro's `context.locals`.
 * This file extends global types to provide type safety for environment variables
 * accessed via `import.meta.env` and for custom properties added to `Astro.locals`.
 * @module env
 * @see https://docs.astro.build/en/guides/environment-variables/#intellisense-for-typescript
 * @see https://docs.astro.build/en/guides/middleware/#storing-information-in-locals
 */

declare global {
  namespace App {
    /**
     * Extends the `Astro.locals` object to include custom properties available
     * in Astro components and API routes through the `context.locals` or `Astro.locals` object.
     */
    interface Locals {
      /**
       * The Supabase client instance, injected by middleware.
       * @see module:middleware/index
       */
      supabase: SupabaseClient<Database>;
    }
  }
}

/**
 * Defines the shape of environment variables accessible via `import.meta.env`.
 * Ensures type safety when accessing these variables throughout the application.
 * Only variables prefixed with `PUBLIC_` are available on the client-side if not using Astro's server rendering.
 * For server-side code, all defined variables are accessible.
 */
interface ImportMetaEnv {
  /** @description The URL for the Supabase project. */
  readonly SUPABASE_URL: string;
  /** @description The anonymous public key for the Supabase project. */
  readonly SUPABASE_KEY: string;
  /** @description API key for the OpenRouter service. (Example, adjust as needed) */
  readonly OPENROUTER_API_KEY: string;
  // more env variables...
}

/**
 * Extends the `ImportMeta` interface to include the typed `env` object.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
