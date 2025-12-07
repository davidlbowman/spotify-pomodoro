/**
 * React hooks for Spotify authentication and playback.
 *
 * @module
 */

import { Option } from "effect";
import { useCallback, useEffect, useState } from "react";
import { runEffect } from "../effect/runtime";
import type { PlaybackState, Playlist } from "../effect/schema/Playlist";
import { SpotifyAuth } from "../effect/services/SpotifyAuth";
import { SpotifyClient } from "../effect/services/SpotifyClient";

/**
 * Hook for Spotify OAuth authentication.
 *
 * @since 0.0.1
 * @category Hooks
 */
export function useSpotifyAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		runEffect(SpotifyAuth.restoreToken)
			.then((maybeToken) => {
				setIsAuthenticated(Option.isSome(maybeToken));
				setIsLoading(false);
			})
			.catch(() => setIsLoading(false));
	}, []);

	const login = useCallback(async () => {
		const url = await runEffect(SpotifyAuth.getAuthUrl);
		window.location.href = url;
	}, []);

	const handleCallback = useCallback(async (code: string, state: string) => {
		await runEffect(SpotifyAuth.exchangeCode(code, state));
		setIsAuthenticated(true);
	}, []);

	const logout = useCallback(async () => {
		await runEffect(SpotifyAuth.logout);
		setIsAuthenticated(false);
	}, []);

	return {
		isAuthenticated,
		isLoading,
		login,
		handleCallback,
		logout,
	};
}

/**
 * Hook for fetching user playlists.
 *
 * @since 0.0.1
 * @category Hooks
 */
export function useSpotifyPlaylists() {
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPlaylists = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const result = await runEffect(SpotifyClient.getPlaylists);
			setPlaylists(result);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to fetch playlists");
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		playlists,
		isLoading,
		error,
		fetchPlaylists,
	};
}

/**
 * Hook for controlling Spotify playback.
 *
 * @since 0.0.1
 * @category Hooks
 */
export function useSpotifyPlayback() {
	const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);

	const fetchPlaybackState = useCallback(async () => {
		setIsLoading(true);
		try {
			const result = await runEffect(SpotifyClient.getPlaybackState);
			setPlaybackState(result);
		} catch {
			// Ignore errors - user might not have an active device
		} finally {
			setIsLoading(false);
		}
	}, []);

	const play = useCallback(
		async (options?: { contextUri?: string; uris?: string[] }) => {
			await runEffect(SpotifyClient.play(options));
			await fetchPlaybackState();
		},
		[fetchPlaybackState],
	);

	const pause = useCallback(async () => {
		await runEffect(SpotifyClient.pause);
		await fetchPlaybackState();
	}, [fetchPlaybackState]);

	const setShuffle = useCallback(async (state: boolean) => {
		await runEffect(SpotifyClient.setShuffle(state));
	}, []);

	const setRepeat = useCallback(async (state: "off" | "context" | "track") => {
		await runEffect(SpotifyClient.setRepeat(state));
	}, []);

	return {
		playbackState,
		isLoading,
		fetchPlaybackState,
		play,
		pause,
		setShuffle,
		setRepeat,
	};
}
