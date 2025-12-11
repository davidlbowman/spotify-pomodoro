/**
 * Robots.txt endpoint - disallow all crawlers.
 *
 * @module
 * @since 1.1.0
 * @category Pages
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
	const robotsTxt = `User-agent: *
Disallow: /
`;

	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
