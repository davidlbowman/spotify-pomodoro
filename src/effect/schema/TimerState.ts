import { Schema } from "effect";

export const TimerPhase = Schema.Literal("focus", "break", "idle");
export type TimerPhase = typeof TimerPhase.Type;

export const TimerStatus = Schema.Literal("running", "paused", "stopped");
export type TimerStatus = typeof TimerStatus.Type;

export class TimerConfig extends Schema.Class<TimerConfig>("TimerConfig")({
	focusDuration: Schema.Number,
	breakDuration: Schema.Number,
}) {}

export class TimerState extends Schema.Class<TimerState>("TimerState")({
	phase: TimerPhase,
	status: TimerStatus,
	remainingSeconds: Schema.Number,
	overtime: Schema.Number,
	config: TimerConfig,
	sessionCount: Schema.Number,
}) {
	get isOvertime(): boolean {
		return this.remainingSeconds <= 0 && this.status === "running";
	}

	get displayTime(): string {
		const totalSeconds = this.isOvertime
			? this.overtime
			: this.remainingSeconds;
		const minutes = Math.floor(Math.abs(totalSeconds) / 60);
		const seconds = Math.abs(totalSeconds) % 60;
		const sign = this.isOvertime ? "+" : "";
		return `${sign}${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}
}
