import { Schema } from "effect";

export class SpotifyAuthError extends Schema.TaggedError<SpotifyAuthError>()(
	"SpotifyAuthError",
	{
		reason: Schema.Literal(
			"InvalidState",
			"TokenExchangeFailed",
			"TokenRefreshFailed",
			"NotAuthenticated",
		),
		message: Schema.String,
	},
) {}

export class SpotifyApiError extends Schema.TaggedError<SpotifyApiError>()(
	"SpotifyApiError",
	{
		status: Schema.Number,
		message: Schema.String,
	},
) {}
