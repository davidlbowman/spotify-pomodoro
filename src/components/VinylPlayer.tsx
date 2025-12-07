import { useEffect, useState } from "react";
import type { Playlist } from "../effect/schema/Playlist";
import {
	useSpotifyAuth,
	useSpotifyPlayback,
	useSpotifyPlaylists,
} from "../hooks/useSpotify";
import { cn } from "../lib/utils";

export function VinylPlayer() {
	const {
		isAuthenticated,
		isLoading: authLoading,
		login,
		logout,
	} = useSpotifyAuth();
	const {
		playlists,
		isLoading: playlistsLoading,
		fetchPlaylists,
	} = useSpotifyPlaylists();
	const { playbackState, play, pause, fetchPlaybackState } =
		useSpotifyPlayback();
	const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
		null,
	);
	const [showPlaylists, setShowPlaylists] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {
			fetchPlaylists();
			fetchPlaybackState();
		}
	}, [isAuthenticated, fetchPlaylists, fetchPlaybackState]);

	const isPlaying = playbackState?.isPlaying ?? false;

	const handlePlaylistSelect = async (playlist: Playlist) => {
		setSelectedPlaylist(playlist);
		setShowPlaylists(false);
		await play({ contextUri: playlist.uri });
	};

	const handlePlayPause = async () => {
		if (isPlaying) {
			await pause();
		} else if (selectedPlaylist) {
			await play({ contextUri: selectedPlaylist.uri });
		}
	};

	// Not authenticated state - compact inline
	if (!isAuthenticated) {
		return (
			<div className="flex items-center gap-4">
				{/* Small vinyl icon */}
				<div
					className={cn(
						"w-12 h-12 rounded-full",
						"bg-[var(--lofi-vinyl)] border border-border",
						"flex items-center justify-center",
						"opacity-40",
					)}
				>
					<div className="w-4 h-4 rounded-full bg-card/50" />
				</div>

				<button
					type="button"
					onClick={login}
					disabled={authLoading}
					className={cn(
						"px-5 py-2 rounded-xl text-sm transition-all duration-300",
						"bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20",
						"hover:bg-[#1DB954]/20 hover:scale-105",
						"disabled:opacity-50 disabled:cursor-not-allowed",
					)}
				>
					{authLoading ? "connecting..." : "connect spotify"}
				</button>
			</div>
		);
	}

	// Authenticated state - horizontal layout
	return (
		<div className="flex items-center gap-6 relative">
			{/* Vinyl record with album art - smaller */}
			<button
				type="button"
				onClick={handlePlayPause}
				disabled={!selectedPlaylist}
				className={cn(
					"relative group cursor-pointer",
					"transition-transform duration-300 hover:scale-105",
					!selectedPlaylist && "opacity-50 cursor-default hover:scale-100",
				)}
			>
				<div
					className={cn(
						"w-20 h-20 rounded-full",
						"bg-[var(--lofi-vinyl)] border border-border",
						"shadow-lg",
						isPlaying && "animate-spin-slow",
						!isPlaying && selectedPlaylist && "animate-spin-slow paused",
					)}
				>
					{/* Vinyl grooves */}
					<div className="absolute inset-1 rounded-full border border-[var(--lofi-vinyl-groove)]" />
					<div className="absolute inset-2 rounded-full border border-[var(--lofi-vinyl-groove)]" />
					<div className="absolute inset-3 rounded-full border border-[var(--lofi-vinyl-groove)]" />

					{/* Center - Album art or placeholder */}
					<div
						className={cn(
							"absolute inset-[22px] rounded-full overflow-hidden",
							"bg-card border border-border",
							"flex items-center justify-center",
						)}
					>
						{selectedPlaylist?.images[0] ? (
							<img
								src={selectedPlaylist.images[0].url}
								alt={selectedPlaylist.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-muted-foreground/40 text-sm">♪</span>
						)}
					</div>

					{/* Play/Pause overlay */}
					{selectedPlaylist && (
						<div
							className={cn(
								"absolute inset-0 rounded-full flex items-center justify-center",
								"bg-black/0 group-hover:bg-black/30 transition-colors duration-300",
							)}
						>
							<span
								className={cn(
									"text-white/0 group-hover:text-white/80 text-lg transition-all duration-300",
									"transform scale-50 group-hover:scale-100",
								)}
							>
								{isPlaying ? "❚❚" : "▶"}
							</span>
						</div>
					)}
				</div>
			</button>

			{/* Current playlist info + controls */}
			<div className="flex flex-col gap-2">
				{selectedPlaylist ? (
					<div className="text-sm">
						<div className="text-foreground/80 font-medium truncate max-w-[180px]">
							{selectedPlaylist.name}
						</div>
						<div className="text-muted-foreground/50 text-xs">
							{selectedPlaylist.tracksTotal} tracks
						</div>
					</div>
				) : (
					<div className="text-sm text-muted-foreground/50">
						no playlist selected
					</div>
				)}

				{/* Playlist selector toggle */}
				<button
					type="button"
					onClick={() => setShowPlaylists(!showPlaylists)}
					className={cn(
						"px-3 py-1.5 rounded-lg text-xs transition-all duration-300",
						"bg-secondary/50 text-muted-foreground border border-border",
						"hover:bg-secondary hover:text-foreground",
						showPlaylists && "bg-secondary text-foreground",
					)}
				>
					{showPlaylists ? "hide" : "playlists"}
				</button>
			</div>

			{/* Disconnect link */}
			<button
				type="button"
				onClick={logout}
				className="text-xs text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
			>
				disconnect
			</button>

			{/* Playlist dropdown */}
			{showPlaylists && (
				<div
					className={cn(
						"absolute bottom-full mb-4 left-0 w-80",
						"bg-card/95 backdrop-blur-lg rounded-2xl",
						"border border-border",
						"shadow-2xl",
						"overflow-hidden z-50",
					)}
				>
					<div className="p-3 border-b border-border">
						<span className="text-xs text-muted-foreground/60 uppercase tracking-wider">
							your playlists
						</span>
					</div>

					<div className="max-h-64 overflow-y-auto">
						{playlistsLoading ? (
							<div className="p-6 text-center text-muted-foreground/50 text-sm">
								loading playlists...
							</div>
						) : playlists.length === 0 ? (
							<div className="p-6 text-center text-muted-foreground/50 text-sm">
								no playlists found
							</div>
						) : (
							playlists.map((playlist) => (
								<button
									type="button"
									key={playlist.id}
									onClick={() => handlePlaylistSelect(playlist)}
									className={cn(
										"w-full flex items-center gap-3 p-3 text-left",
										"hover:bg-secondary/50 transition-colors duration-200",
										selectedPlaylist?.id === playlist.id && "bg-primary/10",
									)}
								>
									{playlist.images[0] ? (
										<img
											src={playlist.images[0].url}
											alt={playlist.name}
											className="w-10 h-10 rounded-lg object-cover"
										/>
									) : (
										<div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground/30">
											♪
										</div>
									)}
									<div className="flex-1 min-w-0">
										<div className="text-sm text-foreground/90 truncate">
											{playlist.name}
										</div>
										<div className="text-xs text-muted-foreground/50">
											{playlist.tracksTotal} tracks
										</div>
									</div>
								</button>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}
