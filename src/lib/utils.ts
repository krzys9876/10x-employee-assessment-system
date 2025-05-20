import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes intelligently.
 * This function uses `clsx` to conditionally join class names and `tailwind-merge` to resolve conflicting Tailwind classes.
 * @param {...ClassValue} inputs - A list of class values to combine. These can be strings, arrays, or objects.
 * @returns {string} A string of combined and merged class names.
 * @module lib/utils
 * @example
 * ```ts
 * cn("p-4", "font-bold", { "bg-red-500": true, "text-white": false });
 * // Returns: "p-4 font-bold bg-red-500"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
