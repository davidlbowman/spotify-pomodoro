import type { SpotifyTokenInfo } from "@/lib/spotify/types";

const CLIENT_ID = "b9a43f1ecd77436cbcd64bbcc00190a4";
const REDIRECT_URI = "http://localhost:5173/";
const SCOPES = [
	"user-read-playback-state",
	"user-modify-playback-state",
	"playlist-read-private",
	"playlist-read-collaborative",
];

export function generateSpotifyAuthUrl(): string {
	const state = Math.random().toString(36).substring(7);
	localStorage.setItem("spotify_auth_state", state);

	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		response_type: "token",
		redirect_uri: REDIRECT_URI,
		state: state,
		scope: SCOPES.join(" "),
	});

	return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export function getTokenFromUrl(): SpotifyTokenInfo | null {
	if (typeof window === "undefined") return null;

	const hash = window.location.hash.substring(1);
	const params = new URLSearchParams(hash);

	const accessToken = params.get("access_token");
	const state = params.get("state");
	const storedState = localStorage.getItem("spotify_auth_state");

	if (!accessToken || !state || state !== storedState) {
		return null;
	}

	const expiresIn = Number.parseInt(params.get("expires_in") || "3600", 10);
	const expiresAt = Date.now() + expiresIn * 1000;

	// Clear the hash from the URL
	window.history.replaceState({}, document.title, window.location.pathname);

	return {
		accessToken,
		expiresAt,
	};
}

export function isTokenValid(token: SpotifyTokenInfo | null): boolean {
	if (!token) return false;
	return Date.now() < token.expiresAt;
}

export async function getUserPlaylists(token: string) {
	const response = await fetch("https://api.spotify.com/v1/me/playlists", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch playlists");
	}

	return response.json() as Promise<{
		items: Array<{
			id: string;
			name: string;
			images: Array<{ url: string }>;
			owner: { display_name: string };
		}>;
	}>;
}
