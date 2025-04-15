import { Effect, Schema } from "effect";
import {
	type SpotifyAccessToken,
	SpotifyAccessTokenSchema,
	SpotifyPlaylistsResponseSchema,
} from "./../../../../shared/types/spotify";

export const getCurrentUsersPlaylists = (params: {
	access_token: SpotifyAccessToken["access_token"];
}) =>
	Effect.gen(function* () {
		const { access_token } = yield* Schema.decodeUnknown(
			SpotifyAccessTokenSchema.pick("access_token"),
		)(params);

		const response = yield* Effect.tryPromise({
			try: () =>
				fetch("https://api.spotify.com/v1/me/playlists", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}),
			catch: () => new Error("Sad"),
		});

		const jsonResponse = yield* Effect.tryPromise(() => response.json());

		const parsedResponse = yield* Schema.decodeUnknown(
			SpotifyPlaylistsResponseSchema,
		)(jsonResponse);

		const playlists = parsedResponse.items;

		return playlists;
	});
