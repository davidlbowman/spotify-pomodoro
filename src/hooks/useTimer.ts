/**
 * React hook for timer state and controls.
 *
 * @module
 */

import { Effect, Stream, SubscriptionRef } from "effect";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRuntime, runEffect } from "../effect/runtime";
import {
	TimerConfig,
	type TimerPreset,
	type TimerState,
} from "../effect/schema/TimerState";
import { AudioNotification } from "../effect/services/AudioNotification";
import { TIMER_PRESETS, Timer } from "../effect/services/Timer";
import {
	completeBreakSession,
	completeFocusSession,
	completePomodoro,
	createBreakSession,
	createFocusSession,
	createPomodoro,
} from "../lib/sessionApi";

/**
 * Hook for managing pomodoro timer state and controls.
 *
 * @since 0.0.1
 * @category Hooks
 */
export function useTimer() {
	const [state, setState] = useState<TimerState | null>(null);
	const prevStateRef = useRef<TimerState | null>(null);
	const dbPomodoroIdRef = useRef<string | null>(null);
	const dbFocusSessionIdRef = useRef<string | null>(null);
	const dbBreakSessionIdRef = useRef<string | null>(null);

	useEffect(() => {
		const runtime = getRuntime();
		let disposed = false;

		const subscription = Effect.gen(function* () {
			const timer = yield* Timer;
			const audio = yield* AudioNotification;

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

	useEffect(() => {
		if (!state) return;

		const prev = prevStateRef.current;
		prevStateRef.current = state;

		if (!prev) return;

		const phaseChanged = prev.phase !== state.phase;
		const justStartedRunning =
			prev.status !== "running" && state.status === "running";
		const isNowRunning = state.status === "running";

		if (phaseChanged && prev.phase !== "idle") {
			const elapsedSeconds = prev.totalElapsedSeconds;

			if (prev.phase === "focus" && dbFocusSessionIdRef.current) {
				completeFocusSession(dbFocusSessionIdRef.current, elapsedSeconds).catch(
					(e) => console.error("Failed to complete focus session:", e),
				);
				dbFocusSessionIdRef.current = null;
			} else if (prev.phase === "break" && dbBreakSessionIdRef.current) {
				completeBreakSession(dbBreakSessionIdRef.current, elapsedSeconds).catch(
					(e) => console.error("Failed to complete break session:", e),
				);
				dbBreakSessionIdRef.current = null;

				if (state.phase === "focus" && dbPomodoroIdRef.current) {
					completePomodoro(dbPomodoroIdRef.current).catch((e) =>
						console.error("Failed to complete pomodoro:", e),
					);
					dbPomodoroIdRef.current = null;
				}
			}
		}

		const shouldCreateSession =
			(justStartedRunning && (phaseChanged || prev.phase === "idle")) ||
			(phaseChanged && isNowRunning && state.phase !== "idle");

		if (shouldCreateSession) {
			(async () => {
				try {
					if (state.phase === "focus") {
						if (!dbPomodoroIdRef.current) {
							const pomodoro = await createPomodoro();
							dbPomodoroIdRef.current = pomodoro.id;
						}
						const focusSession = await createFocusSession(
							dbPomodoroIdRef.current,
							state.config.focusDuration,
						);
						dbFocusSessionIdRef.current = focusSession.id;
					} else if (state.phase === "break" && dbPomodoroIdRef.current) {
						const breakSession = await createBreakSession(
							dbPomodoroIdRef.current,
							state.config.breakDuration,
						);
						dbBreakSessionIdRef.current = breakSession.id;
					}
				} catch (e) {
					console.error("Failed to create session:", e);
				}
			})();
		}
	}, [state]);

	const start = useCallback(() => runEffect(Timer.start), []);
	const reset = useCallback(() => runEffect(Timer.reset), []);

	const switchPhase = useCallback(
		(options?: { autoStart?: boolean }) =>
			runEffect(Timer.switchPhase(options)),
		[],
	);

	const endSession = useCallback(
		(options?: { switchToNext?: boolean }) =>
			runEffect(Timer.endSession(options)),
		[],
	);

	const skip = useCallback(() => runEffect(Timer.skip), []);

	const setConfig = useCallback(
		(focusMinutes: number, breakMinutes: number) =>
			runEffect(
				Timer.setConfig(
					new TimerConfig({
						focusDuration: focusMinutes * 60,
						breakDuration: breakMinutes * 60,
						preset: "custom",
					}),
				),
			),
		[],
	);

	const setPreset = useCallback(
		(preset: TimerPreset) => runEffect(Timer.setPreset(preset)),
		[],
	);

	return {
		state,
		start,
		reset,
		switchPhase,
		endSession,
		skip,
		setConfig,
		setPreset,
		presets: TIMER_PRESETS,
	};
}
