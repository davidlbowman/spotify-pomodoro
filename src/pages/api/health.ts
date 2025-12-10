/**
 * Health check API endpoint.
 *
 * @module
 */
import type { APIRoute } from "astro";

/**
 * GET /api/health - Health check for Docker/Coolify monitoring.
 *
 * @since 1.0.0
 * @category API
 */
export const GET: APIRoute = () => {
	return new Response(JSON.stringify({ status: "ok" }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
