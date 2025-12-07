import { Schema } from "effect";

export class SpotifyToken extends Schema.Class<SpotifyToken>("SpotifyToken")({
	accessToken: Schema.String,
	refreshToken: Schema.String,
	expiresAt: Schema.Number,
	scope: Schema.String,
}) {
	get isExpired(): boolean {
		return Date.now() >= this.expiresAt - 60_000;
	}
}

export class PKCEChallenge extends Schema.Class<PKCEChallenge>("PKCEChallenge")(
	{
		verifier: Schema.String,
		challenge: Schema.String,
		state: Schema.String,
	},
) {}
