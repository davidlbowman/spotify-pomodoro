import { Data } from "effect";

export class ParseError extends Data.TaggedError("ParseError")<{
	reason?: unknown;
}> {}

export class SpotifyError extends Data.TaggedError("SpotifyError")<{
	reason?: unknown;
}> {}
