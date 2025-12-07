import { Schema } from "effect";

export class TimerError extends Schema.TaggedError<TimerError>()("TimerError", {
	reason: Schema.Literal("InvalidDuration", "InvalidState"),
	message: Schema.String,
}) {}
