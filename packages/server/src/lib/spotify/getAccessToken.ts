import { Effect, Schema } from "effect";
import { SpotifyError } from "../../types/errors";

export const GetAccessTokenParamsSchema = Schema.Struct({
	clientId: Schema.NonEmptyString,
	clientSecret: Schema.NonEmptyString,
});

type GetAccessTokenParams = typeof GetAccessTokenParamsSchema.Type;

const GetAccessTokenResponseSchema = Schema.Struct({
	access_token: Schema.NonEmptyString,
	token_type: Schema.NonEmptyString,
	expires_in: Schema.Number,
});

export const getAccessToken = (params: GetAccessTokenParams) =>
	Effect.gen(function* () {
		const { clientId, clientSecret } = yield* Schema.decodeUnknown(
			GetAccessTokenParamsSchema,
		)(params);

		const response = yield* Effect.tryPromise({
			try: () => {
				const bodyParams = new URLSearchParams();
				bodyParams.append("grant_type", "client_credentials");
				bodyParams.append("client_id", clientId);
				bodyParams.append("client_secret", clientSecret);

				return fetch("https://accounts.spotify.com/api/token", {
					method: "POST",
					headers: {
						Content_Type: "application/x-www-form-urlencoded",
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
			GetAccessTokenResponseSchema,
		)(jsonData);

		return parsedData;
	});
