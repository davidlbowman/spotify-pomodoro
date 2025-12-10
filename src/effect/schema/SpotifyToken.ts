/**
 * Spotify OAuth token schema.
 *
 * @module
 */

import { Schema } from "effect";

/**
 * Spotify OAuth access token with refresh capability.
 *
 * @since 0.0.1
 * @category Schemas
 */
export class SpotifyToken extends Schema.Class<SpotifyToken>("SpotifyToken")({
	accessToken: Schema.String,
	refreshToken: Schema.String,
	/** Token expiration timestamp in milliseconds */
	expiresAt: Schema.Number,
	scope: Schema.String,
}) {
	get isExpired(): boolean {
		return Date.now() >= this.expiresAt - 60_000;
	}
}
