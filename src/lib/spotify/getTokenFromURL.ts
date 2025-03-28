import type { SpotifyTokenInfo } from "@/lib/spotify/types";

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
