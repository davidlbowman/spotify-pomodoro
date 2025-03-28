import { Data } from "effect";

export class BunError extends Data.TaggedError("BunError")<{
	reason?: unknown;
}> {}

export class LocalStorageError extends Data.TaggedError("LocalStorageError")<{
	reason?: unknown;
}> {}

export class SpotifyError extends Data.TaggedError("SpotifyError")<{
	reason?: unknown;
}> {}
