/**
 * Timer display card component.
 *
 * @module
 */

import { useTimer } from "../hooks/useTimer";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

/**
 * Card displaying timer with controls.
 *
 * @since 0.0.1
 * @category Components
 */
export function TimerDisplay() {
	const { state, start, pause, reset, switchPhase } = useTimer();

	if (!state) {
		return (
			<Card className="w-full max-w-md">
				<CardContent className="p-8">
					<div className="text-center text-muted-foreground">Loading...</div>
				</CardContent>
			</Card>
		);
	}

	const isRunning = state.status === "running";
	const isPaused = state.status === "paused";
	const isOvertime = state.isOvertime;

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center pb-2">
				<CardTitle
					className={cn(
						"text-lg font-medium uppercase tracking-wide",
						state.phase === "focus" && "text-green-600",
						state.phase === "break" && "text-blue-600",
						state.phase === "idle" && "text-muted-foreground",
					)}
				>
					{state.phase === "idle" ? "Ready" : state.phase}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="text-center">
					<div
						className={cn(
							"text-7xl font-mono font-bold tabular-nums",
							isOvertime && "text-orange-500",
						)}
					>
						{state.displayTime}
					</div>
					{isOvertime && (
						<div className="text-sm text-orange-500 mt-2">Overtime</div>
					)}
				</div>

				<div className="flex justify-center gap-3">
					{!isRunning && (
						<Button onClick={start} size="lg" className="w-24">
							{isPaused ? "Resume" : "Start"}
						</Button>
					)}
					{isRunning && (
						<Button
							onClick={pause}
							variant="secondary"
							size="lg"
							className="w-24"
						>
							Pause
						</Button>
					)}
					{(isPaused || (isRunning && isOvertime)) && (
						<Button
							onClick={reset}
							variant="outline"
							size="lg"
							className="w-24"
						>
							Reset
						</Button>
					)}
				</div>

				{state.phase !== "idle" && (
					<div className="flex justify-center">
						<Button
							onClick={switchPhase}
							variant="ghost"
							size="sm"
							className="text-muted-foreground"
						>
							Switch to {state.phase === "focus" ? "Break" : "Focus"}
						</Button>
					</div>
				)}

				{state.sessionCount > 0 && (
					<div className="text-center text-sm text-muted-foreground">
						Sessions completed: {state.sessionCount}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
