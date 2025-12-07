/**
 * Timer-related errors.
 *
 * @module
 */

import { Schema } from "effect";

/**
 * Error from timer operations.
 *
 * @since 0.0.1
 * @category Errors
 */
export class TimerError extends Schema.TaggedError<TimerError>()("TimerError", {
	reason: Schema.Literal("InvalidDuration", "InvalidState"),
	message: Schema.String,
}) {}
