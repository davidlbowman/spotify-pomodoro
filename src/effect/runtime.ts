import { type Effect, ManagedRuntime } from "effect";
import { type MainContext, MainLayer } from "./layers";

let runtime: ManagedRuntime.ManagedRuntime<MainContext, never> | null = null;

export const getRuntime = () => {
	if (!runtime) {
		runtime = ManagedRuntime.make(MainLayer);
	}
	return runtime;
};

export const runEffect = <A, E>(
	effect: Effect.Effect<A, E, MainContext>,
): Promise<A> => {
	return getRuntime().runPromise(effect);
};

export const runEffectSync = <A, E>(
	effect: Effect.Effect<A, E, MainContext>,
): A => {
	return getRuntime().runSync(effect);
};
