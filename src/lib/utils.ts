/**
 * Utility functions for styling.
 *
 * @module
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx.
 *
 * @since 0.0.1
 * @category Utils
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
