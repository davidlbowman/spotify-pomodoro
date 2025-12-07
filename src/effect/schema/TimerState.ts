/**
 * Timer state and configuration schemas.
 *
 * @module
 */

import { Schema } from "effect";

/**
 * Timer phase: focus, break, or idle.
 *
 * @since 0.0.1
 * @category Schemas
 */
export const TimerPhase = Schema.Literal("focus", "break", "idle");

/**
 * @since 0.0.1
 * @category Schemas
 */
export type TimerPhase = typeof TimerPhase.Type;

/**
 * Timer status: running, paused, or stopped.
 *
 * @since 0.0.1
 * @category Schemas
 */
export const TimerStatus = Schema.Literal("running", "paused", "stopped");

/**
 * @since 0.0.1
 * @category Schemas
 */
export type TimerStatus = typeof TimerStatus.Type;

/**
 * Timer configuration with focus and break durations.
 *
 * @since 0.0.1
 * @category Schemas
 */
export class TimerConfig extends Schema.Class<TimerConfig>("TimerConfig")({
	/** Focus duration in seconds */
	focusDuration: Schema.Number,
	/** Break duration in seconds */
	breakDuration: Schema.Number,
}) {}

/**
 * Current timer state including phase, status, and time remaining.
 *
 * @since 0.0.1
 * @category Schemas
 */
export class TimerState extends Schema.Class<TimerState>("TimerState")({
	phase: TimerPhase,
	status: TimerStatus,
	/** Seconds remaining in current phase */
	remainingSeconds: Schema.Number,
	/** Seconds elapsed past zero */
	overtime: Schema.Number,
	config: TimerConfig,
	/** Number of completed focus sessions */
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
