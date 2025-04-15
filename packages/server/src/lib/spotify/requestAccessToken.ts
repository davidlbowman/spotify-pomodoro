import { Effect, Schema } from "effect";
import {
	EnvironmentError,
	SpotifyError,
} from "../../../../client/src/types/errors";
import {
	SpotifyAccessTokenSchema,
	type SpotifyAuthorizationCode,
	SpotifyAuthorizationCodeSchema,
} from "../../../../shared/types/spotify";

export const requestAccessToken = (params: SpotifyAuthorizationCode) =>
	Effect.gen(function* () {
		const { code } = yield* Schema.decodeUnknown(
			SpotifyAuthorizationCodeSchema,
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
						"content-type": "application/x-www-form-urlencoded",
						Authorization: `Basic ${credentials}`,
					},
					body: bodyParams,
				});
			},
			catch: (error) =>
				new SpotifyError({ reason: `Failed to fetch access token: ${error}` }),
		});

		console.log(response);

		const jsonData = yield* Effect.tryPromise({
			try: () => response.json(),
			catch: (error) =>
				new SpotifyError({ reason: `Failed to parse response: ${error}` }),
		});

		const parsedData = yield* Schema.decodeUnknown(SpotifyAccessTokenSchema)(
			jsonData,
		);

		return parsedData;
	});
