import type { SpotifyTokenInfo } from "@/lib/spotify/types";

export function isTokenValid(token: SpotifyTokenInfo | null): boolean {
	if (!token) return false;
	return Date.now() < token.expiresAt;
}
