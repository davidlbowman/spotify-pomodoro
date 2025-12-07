import { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from "../hooks/useTimer";
import { cn } from "../lib/utils";

export function LofiTimer() {
	const { state, start, pause, reset, switchPhase, setConfig } = useTimer();
	const [isEditingMinutes, setIsEditingMinutes] = useState(false);
	const [editValue, setEditValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const isRunning = state?.status === "running";
	const isPaused = state?.status === "paused";
	const isOvertime = state?.isOvertime ?? false;
	const isStopped = state?.status === "stopped";
	const phase = state?.phase ?? "idle";

	// Parse display time into components
	const displayTime = state?.displayTime ?? "25:00";
	const [sign, timeWithoutSign] = displayTime.startsWith("+")
		? ["+", displayTime.slice(1)]
		: ["", displayTime];
	const [minutes, seconds] = timeWithoutSign.split(":");

	// Get the configured duration for current phase
	const configuredMinutes =
		phase === "break"
			? Math.floor((state?.config.breakDuration ?? 300) / 60)
			: Math.floor((state?.config.focusDuration ?? 1500) / 60);

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

	// Determine glow class based on state
	const glowClass = isOvertime
		? "glow-overtime"
		: phase === "focus"
			? "glow-focus"
			: phase === "break"
				? "glow-break"
				: "glow-idle";

	// Color for the timer text
	const textColorClass = isOvertime
		? "text-[#ffb86c]"
		: phase === "focus"
			? "text-[#8fbfa0]"
			: phase === "break"
				? "text-[#b5a0c4]"
				: "text-[#d4a5a5]";

	if (!state) {
		return (
			<div className="flex flex-col items-center">
				<div
					className={cn(
						"w-[420px] h-[240px] rounded-3xl bg-card/80 backdrop-blur-sm",
						"flex items-center justify-center",
						"glow-idle",
					)}
				>
					<span className="text-muted-foreground animate-pulse-soft">
						loading...
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-8">
			{/* Phase indicator */}
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={() => phase !== "idle" && switchPhase()}
					disabled={phase === "idle"}
					className={cn(
						"px-4 py-1.5 rounded-full text-sm tracking-widest uppercase transition-all duration-300",
						phase === "focus" && "bg-[#8fbfa0]/20 text-[#8fbfa0]",
						phase === "break" && "bg-[#b5a0c4]/20 text-[#b5a0c4]",
						phase === "idle" && "bg-[#d4a5a5]/10 text-[#d4a5a5]/60",
						phase !== "idle" && "hover:scale-105 cursor-pointer",
					)}
				>
					{phase === "idle" ? "ready" : phase}
				</button>

				{state.sessionCount > 0 && (
					<span className="text-muted-foreground/60 text-sm">
						session {state.sessionCount}
					</span>
				)}
			</div>

			{/* Main timer display */}
			<div
				className={cn(
					"relative px-12 py-10 rounded-3xl bg-card/60 backdrop-blur-sm",
					"border border-white/5",
					"transition-all duration-500",
					glowClass,
				)}
			>
				<div
					className={cn("font-digital text-8xl tracking-tight", textColorClass)}
				>
					{/* Overtime sign */}
					{sign && <span className="animate-pulse-soft">{sign}</span>}

					{/* Minutes - clickable when stopped */}
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
								"w-[120px] bg-transparent border-b-2 border-current",
								"text-center outline-none font-digital text-8xl",
								"appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
								textColorClass,
							)}
						/>
					) : isStopped || phase === "idle" ? (
						<button
							type="button"
							onClick={handleMinutesClick}
							className={cn(
								"digit-transition inline-block min-w-[120px] text-center",
								"cursor-pointer hover:opacity-70 transition-opacity",
								"bg-transparent border-none p-0 font-digital text-8xl",
								textColorClass,
							)}
							title="Click to edit duration"
						>
							{minutes}
						</button>
					) : (
						<span className="digit-transition inline-block min-w-[120px] text-center">
							{minutes}
						</span>
					)}

					{/* Colon */}
					<span className={cn("mx-1", isRunning && "animate-blink-colon")}>
						:
					</span>

					{/* Seconds */}
					<span className="digit-transition inline-block min-w-[120px] text-center">
						{seconds}
					</span>
				</div>

				{/* Edit hint */}
				{(isStopped || phase === "idle") && !isEditingMinutes && (
					<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40">
						click minutes to edit
					</div>
				)}

				{/* Overtime indicator */}
				{isOvertime && (
					<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#ffb86c]/20 text-[#ffb86c] text-xs tracking-wider uppercase">
						overtime
					</div>
				)}
			</div>

			{/* Controls */}
			<div className="flex items-center gap-4 mt-2">
				{/* Start/Resume button */}
				{!isRunning && (
					<button
						type="button"
						onClick={start}
						className={cn(
							"px-8 py-3 rounded-2xl font-medium tracking-wide transition-all duration-300",
							"bg-[#d4a5a5]/20 text-[#d4a5a5] border border-[#d4a5a5]/30",
							"hover:bg-[#d4a5a5]/30 hover:scale-105",
							"active:scale-95",
						)}
					>
						{isPaused ? "resume" : "start"}
					</button>
				)}

				{/* Pause button */}
				{isRunning && (
					<button
						type="button"
						onClick={pause}
						className={cn(
							"px-8 py-3 rounded-2xl font-medium tracking-wide transition-all duration-300",
							"bg-secondary/50 text-foreground/80 border border-white/10",
							"hover:bg-secondary/70 hover:scale-105",
							"active:scale-95",
						)}
					>
						pause
					</button>
				)}

				{/* Reset button - show when paused or in overtime */}
				{(isPaused || isOvertime) && (
					<button
						type="button"
						onClick={reset}
						className={cn(
							"px-6 py-3 rounded-2xl font-medium tracking-wide transition-all duration-300",
							"bg-transparent text-muted-foreground border border-white/10",
							"hover:bg-white/5 hover:scale-105",
							"active:scale-95",
						)}
					>
						reset
					</button>
				)}

				{/* Switch phase button - only when in overtime */}
				{isOvertime && (
					<button
						type="button"
						onClick={switchPhase}
						className={cn(
							"px-6 py-3 rounded-2xl font-medium tracking-wide transition-all duration-300",
							phase === "focus"
								? "bg-[#b5a0c4]/20 text-[#b5a0c4] border border-[#b5a0c4]/30"
								: "bg-[#8fbfa0]/20 text-[#8fbfa0] border border-[#8fbfa0]/30",
							"hover:scale-105",
							"active:scale-95",
						)}
					>
						{phase === "focus" ? "take a break" : "back to focus"}
					</button>
				)}
			</div>

			{/* Duration presets when stopped */}
			{(isStopped || phase === "idle") && (
				<div className="flex items-center gap-2 mt-2">
					<span className="text-muted-foreground/40 text-xs mr-2">
						presets:
					</span>
					{[15, 25, 45, 60].map((mins) => (
						<button
							type="button"
							key={mins}
							onClick={() => {
								if (phase === "break") {
									setConfig(
										Math.floor((state?.config.focusDuration ?? 1500) / 60),
										mins,
									);
								} else {
									setConfig(
										mins,
										Math.floor((state?.config.breakDuration ?? 300) / 60),
									);
								}
							}}
							className={cn(
								"px-3 py-1 rounded-lg text-xs transition-all duration-200",
								configuredMinutes === mins
									? "bg-[#d4a5a5]/30 text-[#d4a5a5]"
									: "bg-white/5 text-muted-foreground/60 hover:bg-white/10 hover:text-muted-foreground",
							)}
						>
							{mins}m
						</button>
					))}
				</div>
			)}
		</div>
	);
}
