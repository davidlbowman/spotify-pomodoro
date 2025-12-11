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
 * Timer status: running or stopped.
 *
 * @since 0.0.1
 * @category Schemas
 */
export const TimerStatus = Schema.Literal("running", "stopped");

/**
 * @since 0.0.1
 * @category Schemas
 */
export type TimerStatus = typeof TimerStatus.Type;

/**
 * Timer preset configuration.
 *
 * @since 0.2.0
 * @category Schemas
 */
export const TimerPreset = Schema.Literal("classic", "long", "short", "custom");

/**
 * @since 0.2.0
 * @category Schemas
 */
export type TimerPreset = typeof TimerPreset.Type;

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
	/** Current preset name */
	preset: Schema.optionalWith(TimerPreset, { default: () => "classic" }),
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
	/** Seconds elapsed past zero (overtime) */
	overtime: Schema.Number,
	config: TimerConfig,
	/** Number of completed focus sessions */
	sessionCount: Schema.Number,
	/** Current pomodoro cycle ID (groups focus + break) */
	currentPomodoroId: Schema.NullOr(Schema.String),
	/** Current session ID in database */
	currentSessionId: Schema.NullOr(Schema.String),
	/** Total elapsed seconds since session started (for recording) */
	elapsedSeconds: Schema.optionalWith(Schema.Number, { default: () => 0 }),
}) {
	/**
	 * Whether timer is in overtime (past zero).
	 * @since 0.0.1
	 */
	get isOvertime(): boolean {
		return this.remainingSeconds <= 0 && this.status === "running";
	}

	/**
	 * Formatted display time (MM:SS or +MM:SS for overtime).
	 * @since 0.0.1
	 */
	get displayTime(): string {
		const totalSeconds = this.isOvertime
			? this.overtime
			: this.remainingSeconds;
		const minutes = Math.floor(Math.abs(totalSeconds) / 60);
		const seconds = Math.abs(totalSeconds) % 60;
		const sign = this.isOvertime ? "+" : "";
		return `${sign}${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}

	/**
	 * Total time spent in this session (configured time - remaining + overtime).
	 * @since 0.2.0
	 */
	get totalElapsedSeconds(): number {
		const configuredDuration =
			this.phase === "focus"
				? this.config.focusDuration
				: this.phase === "break"
					? this.config.breakDuration
					: 0;
		return configuredDuration - this.remainingSeconds + this.overtime;
	}
}
