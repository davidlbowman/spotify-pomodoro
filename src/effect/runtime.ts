/**
 * Effect runtime for executing effects in browser context.
 *
 * @module
 */

import { type Effect, ManagedRuntime } from "effect";
import { type MainContext, MainLayer } from "./layers";

let runtime: ManagedRuntime.ManagedRuntime<MainContext, never> | null = null;

/**
 * Get or create the singleton Effect runtime.
 *
 * @since 0.0.1
 * @category Runtime
 */
export const getRuntime = () => {
	if (!runtime) {
		runtime = ManagedRuntime.make(MainLayer);
	}
	return runtime;
};

/**
 * Run an effect and return a promise.
 *
 * @since 0.0.1
 * @category Runtime
 */
export const runEffect = <A, E>(
	effect: Effect.Effect<A, E, MainContext>,
): Promise<A> => {
	return getRuntime().runPromise(effect);
};

/**
 * Run an effect synchronously.
 *
 * @since 0.0.1
 * @category Runtime
 */
export const runEffectSync = <A, E>(
	effect: Effect.Effect<A, E, MainContext>,
): A => {
	return getRuntime().runSync(effect);
};
