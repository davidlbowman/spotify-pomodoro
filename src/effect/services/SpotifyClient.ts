import { HttpClient, HttpClientRequest } from "@effect/platform";
import { Effect } from "effect";
import { SpotifyApiError } from "../errors/SpotifyError";
import {
	PlaybackState,
	Playlist,
	PlaylistOwner,
	SpotifyImage,
} from "../schema/Playlist";
import { SpotifyAuth } from "./SpotifyAuth";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export class SpotifyClient extends Effect.Service<SpotifyClient>()(
	"SpotifyClient",
	{
		effect: Effect.gen(function* () {
			// Disable tracer propagation to avoid CORS issues with Spotify API
			const httpClient = (yield* HttpClient.HttpClient).pipe(
				HttpClient.withTracerPropagation(false),
			);
			const auth = yield* SpotifyAuth;

			const authorizedFetch = <A>(
				makeRequest: (
					token: string,
				) => Effect.Effect<A, SpotifyApiError, never>,
			) =>
				Effect.gen(function* () {
					const token = yield* auth.getToken.pipe(
						Effect.mapError(
							(e) =>
								new SpotifyApiError({
									status: 401,
									message: e.message,
								}),
						),
					);
					return yield* makeRequest(token.accessToken);
				});

			const getPlaylists = authorizedFetch((accessToken) =>
				Effect.gen(function* () {
					const request = HttpClientRequest.get(
						`${SPOTIFY_API_BASE}/me/playlists`,
					).pipe(
						HttpClientRequest.setHeader(
							"Authorization",
							`Bearer ${accessToken}`,
						),
						HttpClientRequest.setUrlParams({ limit: "50" }),
					);

					const response = yield* httpClient.execute(request).pipe(
						Effect.flatMap((res) => res.json),
						Effect.mapError(
							() =>
								new SpotifyApiError({
									status: 500,
									message: "Failed to fetch playlists",
								}),
						),
					);

					const data = response as {
						items: Array<{
							id: string;
							name: string;
							description: string | null;
							images: Array<{
								url: string;
								height: number | null;
								width: number | null;
							}>;
							owner: { id: string; display_name: string | null };
							tracks: { total: number };
							uri: string;
						}>;
					};

					return data.items.map(
						(item) =>
							new Playlist({
								id: item.id,
								name: item.name,
								description: item.description,
								images: item.images.map(
									(img) =>
										new SpotifyImage({
											url: img.url,
											height: img.height,
											width: img.width,
										}),
								),
								owner: new PlaylistOwner({
									id: item.owner.id,
									displayName: item.owner.display_name,
								}),
								tracksTotal: item.tracks.total,
								uri: item.uri,
							}),
					);
				}),
			);

			const getPlaybackState = authorizedFetch((accessToken) =>
				Effect.gen(function* () {
					const request = HttpClientRequest.get(
						`${SPOTIFY_API_BASE}/me/player`,
					).pipe(
						HttpClientRequest.setHeader(
							"Authorization",
							`Bearer ${accessToken}`,
						),
					);

					const res = yield* httpClient.execute(request).pipe(
						Effect.mapError(
							() =>
								new SpotifyApiError({
									status: 500,
									message: "Failed to fetch playback state",
								}),
						),
					);

					if (res.status === 204) {
						return null;
					}

					const response = yield* res.json.pipe(
						Effect.mapError(
							() =>
								new SpotifyApiError({
									status: 500,
									message: "Failed to parse playback state",
								}),
						),
					);

					const data = response as {
						is_playing: boolean;
						progress_ms: number | null;
						device?: { id: string };
						context?: { uri: string };
					};

					return new PlaybackState({
						isPlaying: data.is_playing,
						progressMs: data.progress_ms,
						deviceId: data.device?.id ?? null,
						contextUri: data.context?.uri ?? null,
					});
				}),
			);

			const play = (options?: { contextUri?: string; uris?: string[] }) =>
				authorizedFetch((accessToken) =>
					Effect.gen(function* () {
						const body = options?.contextUri
							? { context_uri: options.contextUri }
							: options?.uris
								? { uris: options.uris }
								: {};

						const request = HttpClientRequest.put(
							`${SPOTIFY_API_BASE}/me/player/play`,
						).pipe(
							HttpClientRequest.setHeader(
								"Authorization",
								`Bearer ${accessToken}`,
							),
							HttpClientRequest.bodyUnsafeJson(body),
						);

						yield* httpClient.execute(request).pipe(
							Effect.mapError(
								() =>
									new SpotifyApiError({
										status: 500,
										message: "Failed to start playback",
									}),
							),
						);
					}),
				);

			const pause = authorizedFetch((accessToken) =>
				Effect.gen(function* () {
					const request = HttpClientRequest.put(
						`${SPOTIFY_API_BASE}/me/player/pause`,
					).pipe(
						HttpClientRequest.setHeader(
							"Authorization",
							`Bearer ${accessToken}`,
						),
					);

					yield* httpClient.execute(request).pipe(
						Effect.mapError(
							() =>
								new SpotifyApiError({
									status: 500,
									message: "Failed to pause playback",
								}),
						),
					);
				}),
			);

			return {
				getPlaylists,
				getPlaybackState,
				play,
				pause,
			};
		}),
		accessors: true,
	},
) {}
