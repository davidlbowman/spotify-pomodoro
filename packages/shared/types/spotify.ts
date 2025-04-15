import { Schema } from "effect";

export const SpotifyAuthorizationCodeSchema = Schema.Struct({
	code: Schema.NonEmptyString,
});

export type SpotifyAuthorizationCode =
	typeof SpotifyAuthorizationCodeSchema.Type;

export const SpotifyAccessTokenSchema = Schema.Struct({
	access_token: Schema.NonEmptyString,
	token_type: Schema.NonEmptyString,
	expires_in: Schema.Number,
});

export type SpotifyAccessToken = typeof SpotifyAccessTokenSchema.Type;
