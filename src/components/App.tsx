import { useCallback, useEffect, useRef, useState } from "react";
import type { Playlist } from "../effect/schema/Playlist";
import {
	useSpotifyAuth,
	useSpotifyPlayback,
	useSpotifyPlaylists,
} from "../hooks/useSpotify";
import { useTheme } from "../hooks/useTheme";
import { useTimer } from "../hooks/useTimer";
import { cn } from "../lib/utils";

export function App() {
	const { toggleTheme, isDark } = useTheme();
	const { state, start, pause, reset, switchPhase, setConfig } = useTimer();
	const { isAuthenticated, login, logout } = useSpotifyAuth();
	const { playlists, fetchPlaylists } = useSpotifyPlaylists();
	const {
		playbackState,
		play,
		pause: pauseMusic,
		setShuffle,
		setRepeat,
	} = useSpotifyPlayback();

	const [isEditingMinutes, setIsEditingMinutes] = useState(false);
	const [editValue, setEditValue] = useState("");
	const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
		null,
	);
	const [showPlaylists, setShowPlaylists] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const isRunning = state?.status === "running";
	const isPaused = state?.status === "paused";
	const isOvertime = state?.isOvertime ?? false;
	const isStopped = state?.status === "stopped";
	const phase = state?.phase ?? "idle";
	const isPlaying = playbackState?.isPlaying ?? false;

	// Parse display time
	const displayTime = state?.displayTime ?? "25:00";
	const [sign, timeWithoutSign] = displayTime.startsWith("+")
		? ["+", displayTime.slice(1)]
		: ["", displayTime];
	const [minutes, seconds] = timeWithoutSign.split(":");

	const configuredMinutes =
		phase === "break"
			? Math.floor((state?.config.breakDuration ?? 300) / 60)
			: Math.floor((state?.config.focusDuration ?? 1500) / 60);

	// Fetch playlists when authenticated
	useEffect(() => {
		if (isAuthenticated) {
			fetchPlaylists();
		}
	}, [isAuthenticated, fetchPlaylists]);

	// Keyboard controls
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Don't trigger if editing or in an input
			if (isEditingMinutes || e.target instanceof HTMLInputElement) return;

			if (e.code === "Space" || e.code === "Enter") {
				e.preventDefault();
				if (isRunning) {
					pause();
				} else {
					start();
				}
			} else if (e.code === "KeyR" && (isPaused || isOvertime)) {
				e.preventDefault();
				reset();
			} else if (e.code === "KeyS" && isOvertime) {
				e.preventDefault();
				switchPhase();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isRunning,
		isPaused,
		isOvertime,
		isEditingMinutes,
		start,
		pause,
		reset,
		switchPhase,
	]);

	const handleMinutesClick = useCallback(() => {
		if (isStopped || phase === "idle") {
			setEditValue(configuredMinutes.toString());
			setIsEditingMinutes(true);
		}
	}, [isStopped, phase, configuredMinutes]);

	const handleEditSubmit = useCallback(() => {
		const newMinutes = Math.max(1, Math.min(120, Number(editValue) || 1));
		if (phase === "break") {
			setConfig(
				Math.floor((state?.config.focusDuration ?? 1500) / 60),
				newMinutes,
			);
		} else {
			setConfig(
				newMinutes,
				Math.floor((state?.config.breakDuration ?? 300) / 60),
			);
		}
		setIsEditingMinutes(false);
	}, [editValue, phase, state?.config, setConfig]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				handleEditSubmit();
			} else if (e.key === "Escape") {
				setIsEditingMinutes(false);
			}
		},
		[handleEditSubmit],
	);

	useEffect(() => {
		if (isEditingMinutes && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditingMinutes]);

	const handlePlaylistSelect = async (playlist: Playlist) => {
		setSelectedPlaylist(playlist);
		setShowPlaylists(false);
		await play({ contextUri: playlist.uri });
		// Enable shuffle and repeat so playlist loops forever with random songs
		await setShuffle(true);
		await setRepeat("context");
	};

	const handlePlayPause = async () => {
		if (isPlaying) {
			await pauseMusic();
		} else if (selectedPlaylist) {
			await play({ contextUri: selectedPlaylist.uri });
		}
	};

	// Colors based on phase
	const colorClass = isOvertime
		? "text-[var(--lofi-overtime)]"
		: phase === "focus"
			? "text-[var(--lofi-focus)]"
			: phase === "break"
				? "text-[var(--lofi-break)]"
				: "text-[var(--lofi-idle)]";

	const glowClass = isOvertime
		? "glow-overtime"
		: phase === "focus"
			? "glow-focus"
			: phase === "break"
				? "glow-break"
				: "glow-idle";

	const borderColorClass = isOvertime
		? "border-[var(--lofi-overtime)]"
		: phase === "focus"
			? "border-[var(--lofi-focus)]"
			: phase === "break"
				? "border-[var(--lofi-break)]"
				: "border-[var(--lofi-idle)]";

	if (!state) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<span className="text-muted-foreground animate-pulse-soft font-digital text-4xl">
					--:--
				</span>
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className="min-h-screen flex flex-col"
			tabIndex={-1}
		>
			<div className="noise-overlay" />

			{/* Theme toggle */}
			<header className="fixed top-0 right-0 p-5 z-50">
				<button
					type="button"
					onClick={toggleTheme}
					className={cn(
						"w-10 h-10 rounded-xl flex items-center justify-center",
						"bg-card/60 backdrop-blur-sm border border-border",
						"transition-all duration-300 hover:scale-110",
						"text-lg",
					)}
				>
					{isDark ? "☀️" : "🌙"}
				</button>
			</header>

			{/* Main centered content */}
			<main className="flex-1 flex flex-col items-center justify-center px-6">
				<div className="flex flex-col items-center gap-6">
					{/* Timer display */}
					<div
						className={cn(
							"relative px-10 py-8 rounded-2xl bg-card/40 backdrop-blur-sm",
							"border border-border/30",
							"transition-all duration-500",
							glowClass,
						)}
					>
						{/* Phase badge */}
						{isOvertime ? (
							<div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[var(--lofi-overtime-bg)] text-[var(--lofi-overtime)] text-sm tracking-widest uppercase">
								overtime
							</div>
						) : phase === "focus" ? (
							<div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[var(--lofi-focus-bg)] text-[var(--lofi-focus)] text-sm tracking-widest uppercase">
								focus
							</div>
						) : phase === "break" ? (
							<div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[var(--lofi-break-bg)] text-[var(--lofi-break)] text-sm tracking-widest uppercase">
								break
							</div>
						) : null}

						<div
							className={cn(
								"font-digital timer-display tracking-tight",
								colorClass,
							)}
						>
							{sign && <span className="animate-pulse-soft">{sign}</span>}

							{isEditingMinutes ? (
								<input
									ref={inputRef}
									type="number"
									min={1}
									max={120}
									value={editValue}
									onChange={(e) => setEditValue(e.target.value)}
									onBlur={handleEditSubmit}
									onKeyDown={handleKeyDown}
									className={cn(
										"w-[1.4em] bg-transparent border-b-2",
										borderColorClass,
										"text-center outline-none font-digital timer-display-input",
										"appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
										colorClass,
									)}
								/>
							) : isStopped || phase === "idle" ? (
								<button
									type="button"
									onClick={handleMinutesClick}
									className={cn(
										"digit-transition inline-block w-[1.4em] text-center",
										"cursor-pointer hover:opacity-60 transition-opacity",
										"bg-transparent border-none p-0 font-digital timer-display",
										colorClass,
									)}
								>
									{minutes}
								</button>
							) : (
								<span className="digit-transition inline-block w-[1.4em] text-center">
									{minutes}
								</span>
							)}

							<span className="mx-1">:</span>

							<span className="digit-transition inline-block w-[1.4em] text-center">
								{seconds}
							</span>
						</div>
					</div>

					{/* Keyboard hint */}
					<span className="text-muted-foreground/40 text-xs tracking-wide">
						{isRunning
							? "space to pause"
							: isPaused
								? "space to resume · r to reset"
								: "space to start"}
						{isOvertime && " · s to switch"}
					</span>

					{/* Music section */}
					<div className="flex items-center gap-4 mt-4">
						{!isAuthenticated ? (
							<button
								type="button"
								onClick={login}
								className={cn(
									"flex items-center gap-2 px-4 py-2 rounded-xl text-sm",
									"bg-[#1DB954]/10 text-[#1DB954]/70 border border-[#1DB954]/20",
									"hover:bg-[#1DB954]/20 hover:text-[#1DB954] transition-all duration-300",
								)}
							>
								<span className="text-base">♪</span>
								<span>spotify</span>
							</button>
						) : (
							<>
								{/* Vinyl - 30% larger (w-14 -> w-[4.5rem]) */}
								<button
									type="button"
									onClick={handlePlayPause}
									disabled={!selectedPlaylist}
									className={cn(
										"relative group transition-transform duration-300",
										selectedPlaylist && "hover:scale-105 cursor-pointer",
										!selectedPlaylist && "opacity-40 cursor-default",
									)}
								>
									<div
										className={cn(
											"w-[4.5rem] h-[4.5rem] rounded-full bg-[var(--lofi-vinyl)] border border-border",
											isPlaying && "animate-spin-slow",
											!isPlaying &&
												selectedPlaylist &&
												"animate-spin-slow paused",
										)}
									>
										<div className="absolute inset-1.5 rounded-full border border-[var(--lofi-vinyl-groove)]" />
										<div className="absolute inset-3 rounded-full border border-[var(--lofi-vinyl-groove)]" />
										<div
											className={cn(
												"absolute inset-[18px] rounded-full overflow-hidden",
												"bg-card border border-border flex items-center justify-center",
											)}
										>
											{selectedPlaylist?.images[0] ? (
												<img
													src={selectedPlaylist.images[0].url}
													alt=""
													className="w-full h-full object-cover"
												/>
											) : (
												<span className="text-muted-foreground/30 text-xs">
													♪
												</span>
											)}
										</div>
									</div>
								</button>

								{/* Playlist selector - 30% larger */}
								<div className="relative">
									<button
										type="button"
										onClick={() => setShowPlaylists(!showPlaylists)}
										className={cn(
											"flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-base",
											"bg-secondary/30 text-muted-foreground border border-border",
											"hover:bg-secondary/50 hover:text-foreground transition-all duration-300",
										)}
									>
										<span className="truncate max-w-[160px]">
											{selectedPlaylist?.name ?? "playlist"}
										</span>
										<span className="text-xs opacity-50">▼</span>
									</button>

									{showPlaylists && (
										<div
											className={cn(
												"absolute bottom-full mb-2 left-0 w-72",
												"bg-card/95 backdrop-blur-lg rounded-xl",
												"border border-border shadow-xl",
												"overflow-hidden z-50",
											)}
										>
											<div className="max-h-56 overflow-y-auto">
												{playlists.map((playlist) => (
													<button
														type="button"
														key={playlist.id}
														onClick={() => handlePlaylistSelect(playlist)}
														className={cn(
															"w-full flex items-center gap-3 p-3 text-left",
															"hover:bg-secondary/50 transition-colors",
															selectedPlaylist?.id === playlist.id &&
																"bg-primary/10",
														)}
													>
														{playlist.images[0] ? (
															<img
																src={playlist.images[0].url}
																alt=""
																className="w-10 h-10 rounded object-cover"
															/>
														) : (
															<div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-muted-foreground/30 text-sm">
																♪
															</div>
														)}
														<span className="truncate text-foreground/80">
															{playlist.name}
														</span>
													</button>
												))}
											</div>
										</div>
									)}
								</div>

								{/* Disconnect */}
								<button
									type="button"
									onClick={logout}
									className="text-xs text-muted-foreground/30 hover:text-muted-foreground/50 transition-colors"
								>
									×
								</button>
							</>
						)}
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="py-5 text-center">
				<a
					href="https://github.com/davidlbowman/spotify-pomodoro"
					target="_blank"
					rel="noopener noreferrer"
					className="text-muted-foreground/30 hover:text-muted-foreground/50 text-xs transition-colors"
				>
					spotify-pomodoro
				</a>
			</footer>
		</div>
	);
}
