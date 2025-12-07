/**
 * Spotify API and authentication errors.
 *
 * @module
 */

import { Schema } from "effect";

/**
 * Authentication error during OAuth flow.
 *
 * @since 0.0.1
 * @category Errors
 */
export class SpotifyAuthError extends Schema.TaggedError<SpotifyAuthError>()(
	"SpotifyAuthError",
	{
		reason: Schema.Literal(
			"InvalidState",
			"TokenExchangeFailed",
			"TokenRefreshFailed",
			"NotAuthenticated",
		),
		message: Schema.String,
	},
) {}

/**
 * Error from Spotify Web API calls.
 *
 * @since 0.0.1
 * @category Errors
 */
export class SpotifyApiError extends Schema.TaggedError<SpotifyApiError>()(
	"SpotifyApiError",
	{
		status: Schema.Number,
		message: Schema.String,
	},
) {}
