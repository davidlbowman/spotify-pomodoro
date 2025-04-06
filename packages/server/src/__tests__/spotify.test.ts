import { describe, expect, test } from "bun:test";
import { Effect, Schema } from "effect";
import {
	GetAccessTokenParamsSchema,
	getAccessToken,
} from "../lib/spotify/getAccessToken";
import { EnvironmentError } from "../types/errors";

describe("Spotify Tests", () => {
	test("should get access token", async () => {
		const program = Effect.gen(function* () {
			const clientId = process.env.SPOTIFY_CLIENT_ID;
			const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

			if (!clientId || !clientSecret) {
				throw new EnvironmentError({
					reason: "SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set",
				});
			}

			const params = Schema.encodeSync(GetAccessTokenParamsSchema)({
				clientId,
				clientSecret,
			});

			const accessToken = yield* getAccessToken(params);

			return accessToken;
		});

		const result = await Effect.runPromise(program);

		expect(result.access_token).toBeDefined();
	});
});
