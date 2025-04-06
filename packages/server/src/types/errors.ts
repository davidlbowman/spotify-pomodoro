import { Data } from "effect";

export class SpotifyError extends Data.TaggedError("SpotifyError")<{
	reason?: unknown;
}> {}
