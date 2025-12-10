/**
 * Session schemas for Effect.
 *
 * @module
 */
import { Schema } from "effect";

/**
 * Pomodoro record from database.
 *
 * @since 0.2.0
 * @category Schemas
 */
export class Pomodoro extends Schema.Class<Pomodoro>("Pomodoro")({
	id: Schema.String,
	createdAt: Schema.DateFromNumber,
	completedAt: Schema.NullOr(Schema.DateFromNumber),
}) {}

/**
 * Focus session record from database.
 *
 * @since 0.2.0
 * @category Schemas
 */
export class FocusSession extends Schema.Class<FocusSession>("FocusSession")({
	id: Schema.String,
	pomodoroId: Schema.String,
	configuredSeconds: Schema.Number,
	elapsedSeconds: Schema.Number,
	startedAt: Schema.DateFromNumber,
	completedAt: Schema.NullOr(Schema.DateFromNumber),
	completed: Schema.Boolean,
	createdAt: Schema.DateFromNumber,
}) {
	/**
	 * Overtime is derived: elapsed - configured (0 if no overtime).
	 * @since 0.2.0
	 */
	get overtime(): number {
		return Math.max(0, this.elapsedSeconds - this.configuredSeconds);
	}
}

/**
 * Break session record from database.
 *
 * @since 0.2.0
 * @category Schemas
 */
export class BreakSession extends Schema.Class<BreakSession>("BreakSession")({
	id: Schema.String,
	pomodoroId: Schema.String,
	configuredSeconds: Schema.Number,
	elapsedSeconds: Schema.Number,
	startedAt: Schema.DateFromNumber,
	completedAt: Schema.NullOr(Schema.DateFromNumber),
	completed: Schema.Boolean,
	createdAt: Schema.DateFromNumber,
}) {
	/**
	 * Overtime is derived: elapsed - configured (0 if no overtime).
	 * @since 0.2.0
	 */
	get overtime(): number {
		return Math.max(0, this.elapsedSeconds - this.configuredSeconds);
	}
}

/**
 * Input for creating a new focus session.
 *
 * @since 0.2.0
 * @category Schemas
 */
export class CreateFocusSessionInput extends Schema.Class<CreateFocusSessionInput>(
	"CreateFocusSessionInput",
)({
	pomodoroId: Schema.String,
	configuredSeconds: Schema.Number,
}) {}

/**
 * Input for creating a new break session.
 *
 * @since 0.2.0
 * @category Schemas
 */
export class CreateBreakSessionInput extends Schema.Class<CreateBreakSessionInput>(
	"CreateBreakSessionInput",
)({
	pomodoroId: Schema.String,
	configuredSeconds: Schema.Number,
}) {}

/**
 * Input for completing a session.
 *
 * @since 0.2.0
 * @category Schemas
 */
export class CompleteSessionInput extends Schema.Class<CompleteSessionInput>(
	"CompleteSessionInput",
)({
	elapsedSeconds: Schema.Number,
}) {}

/**
 * Stats computed from session data.
 *
 * @since 0.2.0
 * @category Schemas
 */
export class SessionStats extends Schema.Class<SessionStats>("SessionStats")({
	/** Total pomodoro cycles started */
	totalPomodoros: Schema.Number,
	/** Total completed focus sessions */
	completedFocusSessions: Schema.Number,
	/** Total completed break sessions */
	completedBreakSessions: Schema.Number,
	/** Total time in focus sessions (seconds) */
	totalFocusSeconds: Schema.Number,
	/** Total time in break sessions (seconds) */
	totalBreakSeconds: Schema.Number,
	/** Total overtime in focus sessions (seconds) */
	totalFocusOvertimeSeconds: Schema.Number,
	/** Total overtime in break sessions (seconds) */
	totalBreakOvertimeSeconds: Schema.Number,
	/** Current daily streak */
	currentStreak: Schema.Number,
	/** Longest ever streak */
	longestStreak: Schema.Number,
	/** Pomodoros completed today */
	todayPomodoros: Schema.Number,
	/** Pomodoros completed this week */
	thisWeekPomodoros: Schema.Number,
}) {}
