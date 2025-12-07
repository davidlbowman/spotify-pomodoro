import { Effect, Stream, SubscriptionRef } from "effect";
import { useCallback, useEffect, useState } from "react";
import { getRuntime, runEffect } from "../effect/runtime";
import { TimerConfig, type TimerState } from "../effect/schema/TimerState";
import { AudioNotification } from "../effect/services/AudioNotification";
import { Timer } from "../effect/services/Timer";

export function useTimer() {
	const [state, setState] = useState<TimerState | null>(null);

	useEffect(() => {
		const runtime = getRuntime();
		let disposed = false;

		const subscription = Effect.gen(function* () {
			const timer = yield* Timer;
			const audio = yield* AudioNotification;

			yield* audio.init;

			yield* timer.setOnTimerEnd(() => {
				runEffect(audio.play);
			});

			const initial = yield* SubscriptionRef.get(timer.state);
			if (!disposed) setState(initial);

			yield* Stream.runForEach(timer.changes, (newState) =>
				Effect.sync(() => {
					if (!disposed) setState(newState);
				}),
			);
		});

		const fiber = runtime.runFork(subscription);

		return () => {
			disposed = true;
			runtime.runPromise(fiber.interruptAsFork(fiber.id()));
		};
	}, []);

	const start = useCallback(() => runEffect(Timer.start), []);
	const pause = useCallback(() => runEffect(Timer.pause), []);
	const reset = useCallback(() => runEffect(Timer.reset), []);
	const switchPhase = useCallback(() => runEffect(Timer.switchPhase), []);
	const setConfig = useCallback(
		(focusMinutes: number, breakMinutes: number) =>
			runEffect(
				Timer.setConfig(
					new TimerConfig({
						focusDuration: focusMinutes * 60,
						breakDuration: breakMinutes * 60,
					}),
				),
			),
		[],
	);

	return {
		state,
		start,
		pause,
		reset,
		switchPhase,
		setConfig,
	};
}
