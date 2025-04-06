import { Data } from "effect";

export class EnvironmentError extends Data.TaggedError("EnvironmentError")<{
	reason?: unknown;
}> {}

export class ParseError extends Data.TaggedError("ParseError")<{
	reason?: unknown;
}> {}

export class SpotifyError extends Data.TaggedError("SpotifyError")<{
	reason?: unknown;
}> {}
