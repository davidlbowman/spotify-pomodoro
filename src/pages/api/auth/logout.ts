/**
 * Logout endpoint - clears auth cookie.
 *
 * @module
 */

import type { APIRoute } from "astro";
import { COOKIE_NAME } from "@/effect/services/Auth";

/**
 * POST /api/auth/logout - Clear auth cookie.
 *
 * @since 1.1.0
 * @category API
 */
export const POST: APIRoute = async ({ cookies }) => {
	cookies.delete(COOKIE_NAME, { path: "/" });

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
