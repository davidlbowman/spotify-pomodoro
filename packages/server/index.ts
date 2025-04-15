import { NodeSdk } from "@effect/opentelemetry";
import {
	BatchSpanProcessor,
	ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base";
import { Effect, Schema } from "effect";
import { SpotifyAuthorizationCodeSchema } from "../shared/types/spotify";
import { requestAccessToken } from "./src/lib/spotify/requestAccessToken";

const NodeSdkLive = NodeSdk.layer(() => ({
	resource: { serviceName: "spotify-pomodoro" },
	spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
}));

Bun.serve({
	port: 3000,

	routes: {
		"/api/spotify/requestAccessToken": {
			POST: async (req: Request) => {
				const program = Effect.gen(function* () {
					const body = yield* Effect.tryPromise(() => req.json());
					const code = yield* Schema.decodeUnknown(
						SpotifyAuthorizationCodeSchema,
					)(body);
					const accessToken = yield* requestAccessToken(code);
					return accessToken;
				}).pipe(
					Effect.withSpan("request-access-token"),
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
				const result = await Effect.runPromise(
					program.pipe(Effect.provide(NodeSdkLive)),
				);
				return result;
			},
		},
	},

	fetch(req) {
		return new Response("Hello via Bun!");
	},
});
