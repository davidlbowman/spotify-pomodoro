import { PlaylistSelector } from "./PlaylistSelector";
import { SpotifyLogin } from "./SpotifyLogin";
import { TimerDisplay } from "./TimerDisplay";
import { TimerSettings } from "./TimerSettings";

export function App() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="container mx-auto px-4 py-8">
				<header className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">Spotify Pomodoro</h1>
					<p className="text-muted-foreground">
						Focus with your favorite music
					</p>
				</header>

				<div className="flex flex-col items-center gap-6">
					<TimerDisplay />
					<TimerSettings />
					<SpotifyLogin />
					<PlaylistSelector />
				</div>
			</div>
		</div>
	);
}
