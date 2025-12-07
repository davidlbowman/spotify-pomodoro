/**
 * Effect layer composition for application services.
 *
 * @module
 */

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

/**
 * Main application layer with all services.
 *
 * @since 0.0.1
 * @category Layers
 */
export const MainLayer = Layer.mergeAll(
	SpotifyAuthLive,
	SpotifyClientLive,
	Timer.Default,
	AudioNotification.Default,
);

/**
 * Context type for the main layer.
 *
 * @since 0.0.1
 * @category Layers
 */
export type MainContext = Layer.Layer.Success<typeof MainLayer>;
