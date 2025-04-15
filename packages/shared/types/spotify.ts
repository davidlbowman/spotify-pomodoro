import { Schema } from "effect";

export const SpotifyAuthorizationCodeSchema = Schema.Struct({
	code: Schema.NonEmptyString,
});

export type SpotifyAuthorizationCode =
	typeof SpotifyAuthorizationCodeSchema.Type;

export const SpotifyAccessTokenSchema = Schema.Struct({
	access_token: Schema.NonEmptyString,
	token_type: Schema.NonEmptyString,
	expires_in: Schema.Number,
});

export type SpotifyAccessToken = typeof SpotifyAccessTokenSchema.Type;

export const PlayListItemsSchema = Schema.Struct({
	collaborative: Schema.Boolean,
	description: Schema.String,
	external_urls: Schema.Struct({
		spotify: Schema.String,
	}),
	href: Schema.String,
	id: Schema.String,
	images: Schema.Array(
		Schema.Struct({
			url: Schema.String,
			height: Schema.Number,
			width: Schema.Number,
		}),
	),
	name: Schema.String,
	owner: Schema.Struct({
		external_urls: Schema.Struct({
			spotify: Schema.String,
		}),
		href: Schema.String,
		id: Schema.String,
		type: Schema.Literal("user"),
		uri: Schema.String,
		display_name: Schema.String,
	}),
	public: Schema.Boolean,
	snapshot_id: Schema.String,
	tracks: Schema.Struct({
		href: Schema.String,
		total: Schema.Number,
	}),
	type: Schema.String,
	uri: Schema.String,
});

export type PlayListItems = typeof PlayListItemsSchema.Type;

export const SpotifyPlaylistsResponseSchema = Schema.Struct({
	href: Schema.String,
	limit: Schema.Number,
	next: Schema.NullOr(Schema.String),
	offset: Schema.Number,
	previous: Schema.NullOr(Schema.String),
	total: Schema.Number,
	items: Schema.Array(PlayListItemsSchema),
});

export type SpotifyPlaylistsResponse =
	typeof SpotifyPlaylistsResponseSchema.Type;
