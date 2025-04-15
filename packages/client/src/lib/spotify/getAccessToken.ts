import { Effect, Schema } from "effect";
import {
	SpotifyAccessTokenSchema,
	type SpotifyAuthorizationCode,
	SpotifyAuthorizationCodeSchema,
} from "./../../../../shared/types/spotify";

export const getAccessToken = (params: SpotifyAuthorizationCode) =>
	Effect.gen(function* () {
		const { code } = yield* Schema.decodeUnknown(
			SpotifyAuthorizationCodeSchema,
		)(params);

		const response = yield* Effect.tryPromise(() =>
			fetch("http://localhost:3000/api/spotify/requestAccessToken", {
				method: "POST",
				body: JSON.stringify({ code }),
			}),
		);

		const jsonResponse = yield* Effect.tryPromise(() => response.json());

		const accessToken = yield* Schema.decodeUnknown(SpotifyAccessTokenSchema)(
			jsonResponse,
		);

		return accessToken;
	});
