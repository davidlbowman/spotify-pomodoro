import { Schema } from "effect";

export class SpotifyImage extends Schema.Class<SpotifyImage>("SpotifyImage")({
	url: Schema.String,
	height: Schema.NullOr(Schema.Number),
	width: Schema.NullOr(Schema.Number),
}) {}

export class PlaylistOwner extends Schema.Class<PlaylistOwner>("PlaylistOwner")(
	{
		id: Schema.String,
		displayName: Schema.NullOr(Schema.String),
	},
) {}

export class Playlist extends Schema.Class<Playlist>("Playlist")({
	id: Schema.String,
	name: Schema.String,
	description: Schema.NullOr(Schema.String),
	images: Schema.Array(SpotifyImage),
	owner: PlaylistOwner,
	tracksTotal: Schema.Number,
	uri: Schema.String,
}) {}

export class PlaybackState extends Schema.Class<PlaybackState>("PlaybackState")(
	{
		isPlaying: Schema.Boolean,
		progressMs: Schema.NullOr(Schema.Number),
		deviceId: Schema.NullOr(Schema.String),
		contextUri: Schema.NullOr(Schema.String),
	},
) {}
