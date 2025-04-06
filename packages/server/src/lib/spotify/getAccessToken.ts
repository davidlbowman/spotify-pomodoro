import { Effect, Schema } from "effect";
import { ParseError, SpotifyError } from "../../types/errors";

export const GetAccessTokenParamsSchema = Schema.Struct({
	clientId: Schema.String,
	clientSecret: Schema.String,
});

type GetAccessTokenParams = typeof GetAccessTokenParamsSchema.Type;

const GetAccessTokenResponseSchema = Schema.Struct({
	access_token: Schema.String,
	token_type: Schema.String,
	expires_in: Schema.Number,
});

export const getAccessToken = (params: GetAccessTokenParams) =>
	Effect.gen(function* () {
		const { clientId, clientSecret } = yield* Effect.try({
			try: () => Schema.decodeUnknownSync(GetAccessTokenParamsSchema)(params),
			catch: (error) =>
				new ParseError({ reason: `Failed to validate params: ${error}` }),
		});

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

		const parsedData = yield* Effect.try({
			try: () =>
				Schema.decodeUnknownSync(GetAccessTokenResponseSchema)(jsonData),
			catch: (error) =>
				new ParseError({ reason: `Failed to validate response: ${error}` }),
		});

		return parsedData;
	});
