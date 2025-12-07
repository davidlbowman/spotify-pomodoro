import { FetchHttpClient } from "@effect/platform";
import { Layer } from "effect";
import { AudioNotification } from "./services/AudioNotification";
import { SpotifyAuth } from "./services/SpotifyAuth";
import { SpotifyClient } from "./services/SpotifyClient";
import { Timer } from "./services/Timer";

const SpotifyAuthLive = SpotifyAuth.Default.pipe(
	Layer.provide(FetchHttpClient.layer),
);

const SpotifyClientLive = SpotifyClient.Default.pipe(
	Layer.provide(SpotifyAuthLive),
	Layer.provide(FetchHttpClient.layer),
);

export const MainLayer = Layer.mergeAll(
	SpotifyAuthLive,
	SpotifyClientLive,
	Timer.Default,
	AudioNotification.Default,
);

export type MainContext = Layer.Layer.Success<typeof MainLayer>;
