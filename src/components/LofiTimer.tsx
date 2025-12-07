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

	// Color classes using CSS variables
	const colorClass = isOvertime
		? "text-[var(--lofi-overtime)]"
		: phase === "focus"
			? "text-[var(--lofi-focus)]"
			: phase === "break"
				? "text-[var(--lofi-break)]"
				: "text-[var(--lofi-idle)]";

	const bgColorClass = isOvertime
		? "bg-[var(--lofi-overtime-bg)]"
		: phase === "focus"
			? "bg-[var(--lofi-focus-bg)]"
			: phase === "break"
				? "bg-[var(--lofi-break-bg)]"
				: "bg-[var(--lofi-idle-bg)]";

	const borderColorClass = isOvertime
		? "border-[var(--lofi-overtime)]"
		: phase === "focus"
			? "border-[var(--lofi-focus)]"
			: phase === "break"
				? "border-[var(--lofi-break)]"
				: "border-[var(--lofi-idle)]";

	if (!state) {
		return (
			<div className="flex flex-col items-center">
				<div
					className={cn(
						"px-16 py-12 rounded-3xl bg-card/80 backdrop-blur-sm",
						"flex items-center justify-center",
						"glow-idle",
					)}
				>
					<span className="text-muted-foreground animate-pulse-soft timer-display">
						--:--
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-10">
			{/* Phase indicator */}
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={() => phase !== "idle" && switchPhase()}
					disabled={phase === "idle"}
					className={cn(
						"px-5 py-2 rounded-full text-sm tracking-widest uppercase transition-all duration-300",
						bgColorClass,
						colorClass,
						phase !== "idle" && "hover:scale-105 cursor-pointer",
						phase === "idle" && "opacity-60",
					)}
				>
					{phase === "idle" ? "ready" : phase}
				</button>

				{state.sessionCount > 0 && (
					<span className="text-muted-foreground/60 text-sm tracking-wide">
						session {state.sessionCount}
					</span>
				)}
			</div>

			{/* Main timer display - MUCH LARGER */}
			<div
				className={cn(
					"relative px-16 lg:px-24 py-12 lg:py-16 rounded-[2rem] bg-card/60 backdrop-blur-sm",
					"border border-border/50",
					"transition-all duration-500",
					glowClass,
				)}
			>
				<div
					className={cn(
						"font-digital timer-display tracking-tight",
						colorClass,
					)}
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
								"w-[1.5em] bg-transparent border-b-4",
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
								"digit-transition inline-block w-[1.5em] text-center",
								"cursor-pointer hover:opacity-70 transition-opacity",
								"bg-transparent border-none p-0 font-digital timer-display",
								colorClass,
							)}
							title="Click to edit duration"
						>
							{minutes}
						</button>
					) : (
						<span className="digit-transition inline-block w-[1.5em] text-center">
							{minutes}
						</span>
					)}

					{/* Colon */}
					<span className={cn("mx-2", isRunning && "animate-blink-colon")}>
						:
					</span>

					{/* Seconds */}
					<span className="digit-transition inline-block w-[1.5em] text-center">
						{seconds}
					</span>
				</div>

				{/* Edit hint */}
				{(isStopped || phase === "idle") && !isEditingMinutes && (
					<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40 whitespace-nowrap">
						click minutes to edit
					</div>
				)}

				{/* Overtime indicator */}
				{isOvertime && (
					<div
						className={cn(
							"absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs tracking-wider uppercase",
							"bg-[var(--lofi-overtime-bg)] text-[var(--lofi-overtime)]",
						)}
					>
						overtime
					</div>
				)}
			</div>

			{/* Controls */}
			<div className="flex items-center gap-4 mt-4">
				{/* Start/Resume button */}
				{!isRunning && (
					<button
						type="button"
						onClick={start}
						className={cn(
							"px-10 py-4 rounded-2xl font-medium tracking-wide text-lg transition-all duration-300",
							"bg-[var(--lofi-idle-bg)] text-[var(--lofi-idle)] border border-[var(--lofi-idle)]/30",
							"hover:bg-[var(--lofi-idle)]/20 hover:scale-105",
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
							"px-10 py-4 rounded-2xl font-medium tracking-wide text-lg transition-all duration-300",
							"bg-secondary/50 text-foreground/80 border border-border",
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
							"px-8 py-4 rounded-2xl font-medium tracking-wide text-lg transition-all duration-300",
							"bg-transparent text-muted-foreground border border-border",
							"hover:bg-secondary/30 hover:scale-105",
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
							"px-8 py-4 rounded-2xl font-medium tracking-wide text-lg transition-all duration-300",
							phase === "focus"
								? "bg-[var(--lofi-break-bg)] text-[var(--lofi-break)] border border-[var(--lofi-break)]/30"
								: "bg-[var(--lofi-focus-bg)] text-[var(--lofi-focus)] border border-[var(--lofi-focus)]/30",
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
				<div className="flex items-center gap-3 mt-2">
					<span className="text-muted-foreground/40 text-sm mr-2">
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
								"px-4 py-2 rounded-xl text-sm transition-all duration-200",
								configuredMinutes === mins
									? cn(bgColorClass, colorClass)
									: "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
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
