import PomodoroTimer from "@/components/pomodoro-timer";
import SpotifyLogin from "@/components/spotify-login";
import { Button } from "@/components/ui/button";
import {
	type SpotifyTokenInfo,
	pausePlayback,
	startPlayback,
} from "@/lib/spotify";
import { Pause, Play, RefreshCw, Settings } from "lucide-react";
import { useEffect, useState } from "react";

function App() {
	const [time, setTime] = useState(20 * 60);
	const [isActive, setIsActive] = useState(false);
	const [task, setTask] = useState("");
	const [spotifyToken, setSpotifyToken] = useState<SpotifyTokenInfo | null>(
		null,
	);
	const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
		localStorage.getItem("spotify_playlist_id"),
	);

	const toggleTimer = async () => {
		if (!spotifyToken?.accessToken || !selectedPlaylistId) {
			setIsActive(!isActive);
			return;
		}

		try {
			if (isActive) {
				await pausePlayback(spotifyToken.accessToken);
			} else {
				await startPlayback(spotifyToken.accessToken, selectedPlaylistId);
			}
			setIsActive(!isActive);
		} catch (error) {
			console.error("Failed to control Spotify playback:", error);
		}
	};

	const resetTimer = async () => {
		if (spotifyToken?.accessToken && isActive) {
			try {
				await pausePlayback(spotifyToken.accessToken);
			} catch (error) {
				console.error("Failed to pause Spotify playback:", error);
			}
		}
		setTime(20 * 60);
		setIsActive(false);
	};

	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | null = null;

		if (isActive && time > 0) {
			interval = setInterval(() => {
				setTime((prevTime) => prevTime - 1);
			}, 1000);
		} else if (time === 0) {
			setIsActive(false);
			if (spotifyToken?.accessToken) {
				void pausePlayback(spotifyToken.accessToken).catch((error) => {
					console.error("Failed to pause Spotify playback:", error);
				});
			}
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isActive, time, spotifyToken?.accessToken]);

	return (
		<main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
			<img
				src="/background.jpg"
				alt="Comforting background"
				className="absolute inset-0 w-full h-full object-cover"
			/>
			<div className="absolute top-4 right-4">
				<SpotifyLogin
					onPlaylistSelect={(id) => setSelectedPlaylistId(id)}
					onTokenUpdate={(token) => setSpotifyToken(token)}
				/>
			</div>
			<div className="z-10 text-white text-center">
				<PomodoroTimer time={time} />
				<div className="mt-8 space-x-4">
					<Button
						variant="outline"
						size="icon"
						onClick={toggleTimer}
						aria-label={isActive ? "Pause timer" : "Start timer"}
					>
						{isActive ? (
							<Pause className="h-6 w-6 text-gray-600" />
						) : (
							<Play className="h-6 w-6 text-gray-600" />
						)}
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={resetTimer}
						aria-label="Reset timer"
					>
						<RefreshCw className="h-6 w-6 text-gray-600" />
					</Button>
					<Button variant="outline" size="icon" aria-label="Settings">
						<Settings className="h-6 w-6 text-gray-600" />
					</Button>
				</div>
				<div className="mt-8">
					<input
						type="text"
						placeholder="What are you working on?"
						value={task}
						onChange={(e) => setTask(e.target.value)}
						className="px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm text-white placeholder-white/50 w-64"
					/>
				</div>
				<div className="mt-8 italic text-sm">
					"The secret of getting ahead is getting started." - Mark Twain
				</div>
			</div>
		</main>
	);
}

export default App;
