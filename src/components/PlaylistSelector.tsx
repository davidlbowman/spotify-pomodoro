/**
 * Playlist selector card component.
 *
 * @module
 */

import { useEffect, useState } from "react";
import type { Playlist } from "../effect/schema/Playlist";
import {
	useSpotifyAuth,
	useSpotifyPlayback,
	useSpotifyPlaylists,
} from "../hooks/useSpotify";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

/**
 * Card for selecting and controlling Spotify playlist playback.
 *
 * @since 0.0.1
 * @category Components
 */
export function PlaylistSelector() {
	const { isAuthenticated } = useSpotifyAuth();
	const { playlists, isLoading, error, fetchPlaylists } = useSpotifyPlaylists();
	const { playbackState, play, pause, fetchPlaybackState } =
		useSpotifyPlayback();
	const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
		null,
	);

	useEffect(() => {
		if (isAuthenticated) {
			fetchPlaylists();
			fetchPlaybackState();
		}
	}, [isAuthenticated, fetchPlaylists, fetchPlaybackState]);

	if (!isAuthenticated) {
		return null;
	}

	if (isLoading) {
		return (
			<Card className="w-full max-w-md">
				<CardContent className="p-8">
					<div className="text-center text-muted-foreground">
						Loading playlists...
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className="w-full max-w-md">
				<CardContent className="p-8">
					<div className="text-center text-red-500">{error}</div>
					<Button onClick={fetchPlaylists} className="w-full mt-4">
						Retry
					</Button>
				</CardContent>
			</Card>
		);
	}

	const handlePlaylistSelect = async (playlist: Playlist) => {
		setSelectedPlaylist(playlist);
		await play({ contextUri: playlist.uri });
	};

	const handlePlayPause = async () => {
		if (playbackState?.isPlaying) {
			await pause();
		} else if (selectedPlaylist) {
			await play({ contextUri: selectedPlaylist.uri });
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-lg">Select Playlist</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{selectedPlaylist && (
					<div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
						{selectedPlaylist.images[0] && (
							<img
								src={selectedPlaylist.images[0].url}
								alt={selectedPlaylist.name}
								className="w-12 h-12 rounded"
							/>
						)}
						<div className="flex-1 min-w-0">
							<div className="font-medium truncate">
								{selectedPlaylist.name}
							</div>
							<div className="text-sm text-muted-foreground">
								{selectedPlaylist.tracksTotal} tracks
							</div>
						</div>
						<Button onClick={handlePlayPause} variant="ghost" size="sm">
							{playbackState?.isPlaying ? "Pause" : "Play"}
						</Button>
					</div>
				)}

				<div className="max-h-64 overflow-y-auto space-y-1">
					{playlists.map((playlist) => (
						<button
							type="button"
							key={playlist.id}
							onClick={() => handlePlaylistSelect(playlist)}
							className={cn(
								"w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors",
								"hover:bg-muted",
								selectedPlaylist?.id === playlist.id && "bg-muted",
							)}
						>
							{playlist.images[0] ? (
								<img
									src={playlist.images[0].url}
									alt={playlist.name}
									className="w-10 h-10 rounded"
								/>
							) : (
								<div className="w-10 h-10 rounded bg-muted-foreground/20 flex items-center justify-center">
									<span className="text-xs">♪</span>
								</div>
							)}
							<div className="flex-1 min-w-0">
								<div className="font-medium truncate text-sm">
									{playlist.name}
								</div>
								<div className="text-xs text-muted-foreground">
									{playlist.tracksTotal} tracks
								</div>
							</div>
						</button>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
