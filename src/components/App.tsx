import { LofiTimer } from "./LofiTimer";
import { VinylPlayer } from "./VinylPlayer";

export function App() {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Noise texture overlay for that analog feel */}
			<div className="noise-overlay" />

			{/* Main content */}
			<main className="flex-1 flex items-center justify-center px-8 py-12">
				<div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-24">
					{/* Timer - the hero */}
					<LofiTimer />

					{/* Vinyl player - music control */}
					<VinylPlayer />
				</div>
			</main>

			{/* Subtle footer */}
			<footer className="text-center py-6 text-muted-foreground/50 text-sm tracking-wide">
				<span className="opacity-60">lofi pomodoro</span>
				<span className="mx-3 opacity-30">·</span>
				<span className="opacity-40">stay focused, stay cozy</span>
			</footer>
		</div>
	);
}
