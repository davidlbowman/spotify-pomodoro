import { BunError, LocalStorageError } from "@/types/errors";
import { Effect } from "effect";

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const SPOTIFY_REDIRECT_URI = import.meta.env
	.VITE_SPOTIFY_REDIRECT_URI as string;
const SCOPES = [
	"user-read-playback-state",
	"user-modify-playback-state",
	"playlist-read-private",
	"playlist-read-collaborative",
];

export const generateSpotifyAuthUrl = () =>
	Effect.gen(function* () {
		const state = yield* Effect.try({
			try: () => Bun.randomUUIDv7(),
			catch: () => new BunError({ reason: "Failed to generate state" }),
		});

		yield* Effect.try({
			try: () => localStorage.setItem("spotify_auth_state", state),
			catch: () => new LocalStorageError({ reason: "Failed to set state" }),
		});

		const params = new URLSearchParams({
			client_id: SPOTIFY_CLIENT_ID,
			response_type: "token",
			redirect_uri: SPOTIFY_REDIRECT_URI,
			state: state,
			scope: SCOPES.join(" "),
		});

		const url = `https://accounts.spotify.com/authorize?${params.toString()}`;

		return url;
	});
