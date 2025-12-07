import { HttpClient, HttpClientRequest } from "@effect/platform";
import { Effect, Option, Ref } from "effect";
import { SpotifyAuthError } from "../errors/SpotifyError";
import { PKCEChallenge, SpotifyToken } from "../schema/SpotifyToken";

const SPOTIFY_CLIENT_ID = import.meta.env.PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = import.meta.env.PUBLIC_SPOTIFY_REDIRECT_URI;

const SCOPES = [
	"user-read-playback-state",
	"user-modify-playback-state",
	"user-read-currently-playing",
	"playlist-read-private",
	"streaming",
].join(" ");

export class SpotifyAuth extends Effect.Service<SpotifyAuth>()("SpotifyAuth", {
	effect: Effect.gen(function* () {
		// Disable tracer propagation to avoid b3 header causing CORS issues with Spotify
		const httpClient = (yield* HttpClient.HttpClient).pipe(
			HttpClient.withTracerPropagation(false),
		);
		const tokenRef = yield* Ref.make<Option.Option<SpotifyToken>>(
			Option.none(),
		);
		const challengeRef = yield* Ref.make<Option.Option<PKCEChallenge>>(
			Option.none(),
		);

		const generatePKCE = Effect.gen(function* () {
			const verifier = yield* Effect.sync(() => {
				const array = new Uint8Array(32);
				crypto.getRandomValues(array);
				return btoa(String.fromCharCode(...array))
					.replace(/\+/g, "-")
					.replace(/\//g, "_")
					.replace(/=/g, "");
			});

			const challenge = yield* Effect.promise(async () => {
				const encoder = new TextEncoder();
				const data = encoder.encode(verifier);
				const digest = await crypto.subtle.digest("SHA-256", data);
				return btoa(String.fromCharCode(...new Uint8Array(digest)))
					.replace(/\+/g, "-")
					.replace(/\//g, "_")
					.replace(/=/g, "");
			});

			const state = yield* Effect.sync(() => crypto.randomUUID());

			const pkce = new PKCEChallenge({ verifier, challenge, state });
			yield* Ref.set(challengeRef, Option.some(pkce));

			yield* Effect.sync(() => {
				sessionStorage.setItem("spotify_pkce", JSON.stringify(pkce));
			});

			return pkce;
		});

		const getAuthUrl = Effect.gen(function* () {
			const pkce = yield* generatePKCE;

			const params = new URLSearchParams({
				client_id: SPOTIFY_CLIENT_ID,
				response_type: "code",
				redirect_uri: SPOTIFY_REDIRECT_URI,
				scope: SCOPES,
				state: pkce.state,
				code_challenge_method: "S256",
				code_challenge: pkce.challenge,
			});

			return `https://accounts.spotify.com/authorize?${params}`;
		});

		const exchangeCode = (code: string, state: string) =>
			Effect.gen(function* () {
				let maybeChallenge = yield* Ref.get(challengeRef);

				if (Option.isNone(maybeChallenge)) {
					const stored = yield* Effect.sync(() =>
						sessionStorage.getItem("spotify_pkce"),
					);
					if (stored) {
						const parsed = JSON.parse(stored);
						const pkce = new PKCEChallenge(parsed);
						yield* Ref.set(challengeRef, Option.some(pkce));
						maybeChallenge = Option.some(pkce);
					}
				}

				const challenge = yield* Option.match(maybeChallenge, {
					onNone: () =>
						Effect.fail(
							new SpotifyAuthError({
								reason: "InvalidState",
								message: "No PKCE challenge found",
							}),
						),
					onSome: Effect.succeed,
				});

				if (challenge.state !== state) {
					return yield* Effect.fail(
						new SpotifyAuthError({
							reason: "InvalidState",
							message: "State mismatch",
						}),
					);
				}

				const request = HttpClientRequest.post(
					"https://accounts.spotify.com/api/token",
				).pipe(
					HttpClientRequest.setHeader(
						"Content-Type",
						"application/x-www-form-urlencoded",
					),
					HttpClientRequest.bodyUrlParams({
						grant_type: "authorization_code",
						code,
						redirect_uri: SPOTIFY_REDIRECT_URI,
						client_id: SPOTIFY_CLIENT_ID,
						code_verifier: challenge.verifier,
					}),
				);

				const response = yield* httpClient.execute(request).pipe(
					Effect.flatMap((res) => res.json),
					Effect.mapError(
						() =>
							new SpotifyAuthError({
								reason: "TokenExchangeFailed",
								message: "Failed to exchange code for token",
							}),
					),
				);

				const tokenData = response as {
					access_token: string;
					refresh_token: string;
					expires_in: number;
					scope: string;
				};

				const token = new SpotifyToken({
					accessToken: tokenData.access_token,
					refreshToken: tokenData.refresh_token,
					expiresAt: Date.now() + tokenData.expires_in * 1000,
					scope: tokenData.scope,
				});

				yield* Ref.set(tokenRef, Option.some(token));
				yield* Effect.sync(() => {
					localStorage.setItem("spotify_token", JSON.stringify(token));
					sessionStorage.removeItem("spotify_pkce");
				});

				return token;
			});

		const getToken = Effect.gen(function* () {
			const maybeToken = yield* Ref.get(tokenRef);
			return yield* Option.match(maybeToken, {
				onNone: () =>
					Effect.fail(
						new SpotifyAuthError({
							reason: "NotAuthenticated",
							message: "No token available",
						}),
					),
				onSome: (token) =>
					token.isExpired ? refreshToken : Effect.succeed(token),
			});
		});

		const refreshToken: Effect.Effect<SpotifyToken, SpotifyAuthError> =
			Effect.gen(function* () {
				const maybeToken = yield* Ref.get(tokenRef);
				const currentToken = yield* Option.match(maybeToken, {
					onNone: () =>
						Effect.fail(
							new SpotifyAuthError({
								reason: "NotAuthenticated",
								message: "No token to refresh",
							}),
						),
					onSome: Effect.succeed,
				});

				const request = HttpClientRequest.post(
					"https://accounts.spotify.com/api/token",
				).pipe(
					HttpClientRequest.setHeader(
						"Content-Type",
						"application/x-www-form-urlencoded",
					),
					HttpClientRequest.bodyUrlParams({
						grant_type: "refresh_token",
						refresh_token: currentToken.refreshToken,
						client_id: SPOTIFY_CLIENT_ID,
					}),
				);

				const response = yield* httpClient.execute(request).pipe(
					Effect.flatMap((res) => res.json),
					Effect.mapError(
						() =>
							new SpotifyAuthError({
								reason: "TokenRefreshFailed",
								message: "Failed to refresh token",
							}),
					),
				);

				const tokenData = response as {
					access_token: string;
					refresh_token?: string;
					expires_in: number;
					scope: string;
				};

				const newToken = new SpotifyToken({
					accessToken: tokenData.access_token,
					refreshToken: tokenData.refresh_token ?? currentToken.refreshToken,
					expiresAt: Date.now() + tokenData.expires_in * 1000,
					scope: tokenData.scope,
				});

				yield* Ref.set(tokenRef, Option.some(newToken));
				yield* Effect.sync(() => {
					localStorage.setItem("spotify_token", JSON.stringify(newToken));
				});

				return newToken;
			});

		const restoreToken = Effect.gen(function* () {
			const stored = yield* Effect.sync(() =>
				localStorage.getItem("spotify_token"),
			);
			if (stored) {
				const parsed = JSON.parse(stored);
				const token = new SpotifyToken(parsed);
				yield* Ref.set(tokenRef, Option.some(token));
				return Option.some(token);
			}
			return Option.none();
		});

		const logout = Effect.gen(function* () {
			yield* Ref.set(tokenRef, Option.none());
			yield* Effect.sync(() => localStorage.removeItem("spotify_token"));
		});

		return {
			getAuthUrl,
			exchangeCode,
			getToken,
			refreshToken,
			restoreToken,
			logout,
		};
	}),
	accessors: true,
}) {}
