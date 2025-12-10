/**
 * Timer preset selector component.
 *
 * @module
 */

import { useTimer } from "../hooks/useTimer";
import { cn } from "../lib/utils";

const PRESETS = [
	{ id: "short", label: "Short", focus: 15, break: 3, description: "15 / 3" },
	{
		id: "classic",
		label: "Classic",
		focus: 25,
		break: 5,
		description: "25 / 5",
	},
	{ id: "long", label: "Long", focus: 50, break: 10, description: "50 / 10" },
] as const;

/**
 * Minimal preset selector for timer durations.
 *
 * @since 1.0.0
 * @category Components
 */
export function PresetSelector() {
	const { state, setConfig } = useTimer();

	const currentFocus = state ? Math.floor(state.config.focusDuration / 60) : 25;
	const currentBreak = state ? Math.floor(state.config.breakDuration / 60) : 5;

	const activePreset = PRESETS.find(
		(p) => p.focus === currentFocus && p.break === currentBreak,
	)?.id;

	return (
		<div className="flex items-center gap-1">
			{PRESETS.map((preset) => {
				const isActive = activePreset === preset.id;
				return (
					<button
						key={preset.id}
						type="button"
						onClick={() => setConfig(preset.focus, preset.break)}
						className={cn(
							"group relative px-3 py-1.5 rounded-lg text-xs font-medium",
							"transition-all duration-300 ease-out",
							"border border-transparent",
							isActive
								? "bg-primary/15 text-primary border-primary/20"
								: "text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary/30",
						)}
					>
						<span className="relative z-10">{preset.label}</span>
						<span
							className={cn(
								"absolute inset-x-0 -bottom-5 text-[10px] font-mono",
								"opacity-0 group-hover:opacity-100 transition-opacity duration-200",
								"text-muted-foreground/40",
							)}
						>
							{preset.description}
						</span>
					</button>
				);
			})}
		</div>
	);
}
