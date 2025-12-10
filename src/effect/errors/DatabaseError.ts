/**
 * Database error types.
 *
 * @module
 */
import { Schema } from "effect";

/**
 * Error when a pomodoro is not found.
 *
 * @since 0.2.0
 * @category Errors
 */
export class PomodoroNotFoundError extends Schema.TaggedError<PomodoroNotFoundError>()(
	"PomodoroNotFoundError",
	{
		pomodoroId: Schema.String,
	},
) {}

/**
 * Error when a focus session is not found.
 *
 * @since 0.2.0
 * @category Errors
 */
export class FocusSessionNotFoundError extends Schema.TaggedError<FocusSessionNotFoundError>()(
	"FocusSessionNotFoundError",
	{
		sessionId: Schema.String,
	},
) {}

/**
 * Error when a break session is not found.
 *
 * @since 0.2.0
 * @category Errors
 */
export class BreakSessionNotFoundError extends Schema.TaggedError<BreakSessionNotFoundError>()(
	"BreakSessionNotFoundError",
	{
		sessionId: Schema.String,
	},
) {}

/**
 * Generic database operation error.
 *
 * @since 0.2.0
 * @category Errors
 */
export class DatabaseError extends Schema.TaggedError<DatabaseError>()(
	"DatabaseError",
	{
		message: Schema.String,
		cause: Schema.optional(Schema.Unknown),
	},
) {}
