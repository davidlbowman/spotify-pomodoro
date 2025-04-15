import { Effect, Schema } from "effect";
import { SpotifyError } from "./../../../../client/src/types/errors";
import {
	type SpotifyAccessToken,
	SpotifyAccessTokenSchema,
} from "./../../../../shared/types/spotify";

export const getCurrentUsersPlaylists = (params: SpotifyAccessToken) =>
	Effect.gen(function* () {
		const accessToken = yield* Schema.decodeUnknown(SpotifyAccessTokenSchema)(
			params,
		);

		const response = yield* Effect.tryPromise({
			try: () => {
				return fetch("https://api.spotify.com/v1/me/playlists", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${accessToken.access_token}`,
					},
				});
			},
			catch: (error) =>
				new SpotifyError({ reason: `Failed to fetch playlists: ${error}` }),
		});

		return response;
	});
