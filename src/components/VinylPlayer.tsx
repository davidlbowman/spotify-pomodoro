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

	// Not authenticated state
	if (!isAuthenticated) {
		return (
			<div className="flex flex-col items-center gap-6">
				{/* Disconnected vinyl */}
				<div className="relative">
					<div
						className={cn(
							"w-48 h-48 rounded-full",
							"bg-gradient-to-br from-[#2d2a3e] to-[#1a1820]",
							"border border-white/5",
							"flex items-center justify-center",
							"shadow-lg",
						)}
					>
						{/* Vinyl grooves */}
						<div className="absolute inset-4 rounded-full border border-white/5" />
						<div className="absolute inset-8 rounded-full border border-white/5" />
						<div className="absolute inset-12 rounded-full border border-white/5" />
						<div className="absolute inset-16 rounded-full border border-white/5" />

						{/* Center label */}
						<div
							className={cn(
								"w-16 h-16 rounded-full",
								"bg-gradient-to-br from-[#3d3a4e] to-[#2d2a3e]",
								"flex items-center justify-center",
								"text-muted-foreground/40 text-2xl",
							)}
						>
							♪
						</div>
					</div>
				</div>

				{/* Connect button */}
				<button
					type="button"
					onClick={login}
					disabled={authLoading}
					className={cn(
						"px-6 py-2.5 rounded-2xl font-medium tracking-wide transition-all duration-300",
						"bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30",
						"hover:bg-[#1DB954]/30 hover:scale-105",
						"active:scale-95",
						"disabled:opacity-50 disabled:cursor-not-allowed",
					)}
				>
					{authLoading ? "connecting..." : "connect spotify"}
				</button>

				<p className="text-muted-foreground/40 text-xs text-center max-w-[200px]">
					play your favorite lofi beats while you focus
				</p>
			</div>
		);
	}

	// Authenticated state
	return (
		<div className="flex flex-col items-center gap-6 relative">
			{/* Vinyl record with album art */}
			<button
				type="button"
				onClick={handlePlayPause}
				disabled={!selectedPlaylist}
				className={cn(
					"relative group cursor-pointer",
					"transition-transform duration-300 hover:scale-105",
					!selectedPlaylist && "opacity-60 cursor-default hover:scale-100",
				)}
			>
				<div
					className={cn(
						"w-48 h-48 rounded-full",
						"bg-gradient-to-br from-[#2d2a3e] to-[#1a1820]",
						"border border-white/10",
						"shadow-xl",
						isPlaying && "animate-spin-slow",
						!isPlaying && selectedPlaylist && "animate-spin-slow paused",
					)}
				>
					{/* Vinyl grooves */}
					<div className="absolute inset-2 rounded-full border border-white/5" />
					<div className="absolute inset-4 rounded-full border border-white/[0.03]" />
					<div className="absolute inset-6 rounded-full border border-white/5" />
					<div className="absolute inset-8 rounded-full border border-white/[0.03]" />
					<div className="absolute inset-10 rounded-full border border-white/5" />

					{/* Center - Album art or placeholder */}
					<div
						className={cn(
							"absolute inset-[60px] rounded-full overflow-hidden",
							"bg-gradient-to-br from-[#3d3a4e] to-[#2d2a3e]",
							"flex items-center justify-center",
							"border border-white/10",
						)}
					>
						{selectedPlaylist?.images[0] ? (
							<img
								src={selectedPlaylist.images[0].url}
								alt={selectedPlaylist.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-muted-foreground/40 text-xl">♪</span>
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
									"text-white/0 group-hover:text-white/80 text-3xl transition-all duration-300",
									"transform scale-50 group-hover:scale-100",
								)}
							>
								{isPlaying ? "❚❚" : "▶"}
							</span>
						</div>
					)}
				</div>

				{/* Spindle hole effect */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="w-2 h-2 rounded-full bg-[#1a1820] border border-white/10" />
				</div>
			</button>

			{/* Current playlist info */}
			{selectedPlaylist && (
				<div className="text-center">
					<div className="text-sm text-foreground/80 font-medium truncate max-w-[200px]">
						{selectedPlaylist.name}
					</div>
					<div className="text-xs text-muted-foreground/50">
						{selectedPlaylist.tracksTotal} tracks
					</div>
				</div>
			)}

			{/* Playlist selector toggle */}
			<button
				type="button"
				onClick={() => setShowPlaylists(!showPlaylists)}
				className={cn(
					"px-4 py-2 rounded-xl text-sm transition-all duration-300",
					"bg-white/5 text-muted-foreground border border-white/10",
					"hover:bg-white/10 hover:text-foreground",
					showPlaylists && "bg-white/10 text-foreground",
				)}
			>
				{showPlaylists ? "hide playlists" : "choose playlist"}
			</button>

			{/* Playlist dropdown */}
			{showPlaylists && (
				<div
					className={cn(
						"absolute top-full mt-4 w-72",
						"bg-card/95 backdrop-blur-lg rounded-2xl",
						"border border-white/10",
						"shadow-2xl shadow-black/50",
						"overflow-hidden z-50",
					)}
				>
					<div className="p-3 border-b border-white/10">
						<span className="text-xs text-muted-foreground/60 uppercase tracking-wider">
							your playlists
						</span>
					</div>

					<div className="max-h-80 overflow-y-auto">
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
										"hover:bg-white/5 transition-colors duration-200",
										selectedPlaylist?.id === playlist.id && "bg-[#d4a5a5]/10",
									)}
								>
									{playlist.images[0] ? (
										<img
											src={playlist.images[0].url}
											alt={playlist.name}
											className="w-10 h-10 rounded-lg object-cover"
										/>
									) : (
										<div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground/30">
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

			{/* Disconnect link */}
			<button
				type="button"
				onClick={logout}
				className="text-xs text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors mt-2"
			>
				disconnect spotify
			</button>
		</div>
	);
}
