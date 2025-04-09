import { Effect, Schema } from "effect";
import {
	EnvironmentError,
	SpotifyError,
} from "../../../../client/src/types/errors";

export const RequestAccessTokenParamsSchema = Schema.Struct({
	code: Schema.NonEmptyString,
});

type RequestAccessTokenParams = typeof RequestAccessTokenParamsSchema.Type;

export const RequestAccessTokenResponseSchema = Schema.Struct({
	access_token: Schema.NonEmptyString,
	token_type: Schema.NonEmptyString,
	expires_in: Schema.Number,
});

export const requestAccessToken = (params: RequestAccessTokenParams) =>
	Effect.gen(function* () {
		const { code } = yield* Schema.decodeUnknown(
			RequestAccessTokenParamsSchema,
		)(params);

		const spotifyClientId = Bun.env.SPOTIFY_CLIENT_ID;
		const spotifyClientSecret = Bun.env.SPOTIFY_CLIENT_SECRET;
		const spotifyRedirectUri = Bun.env.SPOTIFY_REDIRECT_URI;

		if (!spotifyClientId || !spotifyClientSecret || !spotifyRedirectUri) {
			return yield* new EnvironmentError({
				reason: "Missing a Spotify Environmental Variable",
			});
		}

		const credentials = Buffer.from(
			`${spotifyClientId}:${spotifyClientSecret}`,
		).toString("base64");

		const response = yield* Effect.tryPromise({
			try: () => {
				const bodyParams = new URLSearchParams();
				bodyParams.append("code", code);
				bodyParams.append("redirect_uri", spotifyRedirectUri);
				bodyParams.append("grant_type", "authorization_code");

				return fetch("https://accounts.spotify.com/api/token", {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Basic ${credentials}`,
					},
					body: bodyParams,
				});
			},
			catch: (error) =>
				new SpotifyError({ reason: `Failed to fetch access token: ${error}` }),
		});

		const jsonData = yield* Effect.tryPromise({
			try: () => response.json(),
			catch: (error) =>
				new SpotifyError({ reason: `Failed to parse response: ${error}` }),
		});

		const parsedData = yield* Schema.decodeUnknown(
			RequestAccessTokenResponseSchema,
		)(jsonData);

		return parsedData;
	});
