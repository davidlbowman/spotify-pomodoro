import { Effect, Schema } from "effect";
import { requestAccessToken } from "./src/lib/spotify/requestAccessToken";
import { RequestAccessTokenParamsSchema } from "./src/lib/spotify/requestAccessToken";

Bun.serve({
	port: 3000,

	routes: {
		"/api/spotify/requestAccessToken": {
			POST: async (req: Request) => {
				const program = Effect.gen(function* () {
					const body = yield* Effect.tryPromise(() => req.json());
					const code = yield* Schema.decodeUnknown(
						RequestAccessTokenParamsSchema,
					)(body);
					const accessToken = yield* requestAccessToken(code);
					console.log(accessToken);
					return accessToken;
				}).pipe(
					Effect.match({
						onFailure: () => {
							return new Response(JSON.stringify(false), {
								headers: {},
								status: 401,
								statusText: "Unauthorized",
							});
						},
						onSuccess: (accessToken) => {
							return new Response(JSON.stringify(accessToken), {
								headers: {},
								status: 201,
								statusText: "Created",
							});
						},
					}),
				);
				const result = await Effect.runPromise(program);
				return result;
			},
		},
	},

	fetch(req) {
		return new Response("Hello via Bun!");
	},
});
