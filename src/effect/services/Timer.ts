/**
 * Pomodoro timer service with countdown, overtime, and phase management.
 *
 * @module
 */

import { Effect, Option, Ref, SubscriptionRef } from "effect";
import { TimerConfig, type TimerPhase, TimerState } from "../schema/TimerState";

/**
 * Timer service for managing pomodoro sessions.
 *
 * Provides countdown timer with focus/break phases and overtime tracking.
 *
 * @since 0.0.1
 * @category Services
 */
export class Timer extends Effect.Service<Timer>()("Timer", {
	effect: Effect.gen(function* () {
		const stateRef = yield* SubscriptionRef.make(
			new TimerState({
				phase: "idle",
				status: "stopped",
				remainingSeconds: 25 * 60,
				overtime: 0,
				config: new TimerConfig({
					focusDuration: 25 * 60,
					breakDuration: 5 * 60,
				}),
				sessionCount: 0,
			}),
		);

		const intervalRef = yield* Ref.make<
			Option.Option<ReturnType<typeof setInterval>>
		>(Option.none());

		const onTimerEndRef = yield* Ref.make<Option.Option<() => void>>(
			Option.none(),
		);

		const tick = () =>
			Effect.gen(function* () {
				const currentState = yield* SubscriptionRef.get(stateRef);
				if (currentState.status !== "running") return;

				if (currentState.remainingSeconds > 0) {
					yield* SubscriptionRef.set(
						stateRef,
						new TimerState({
							...currentState,
							remainingSeconds: currentState.remainingSeconds - 1,
						}),
					);
				} else {
					yield* SubscriptionRef.set(
						stateRef,
						new TimerState({
							...currentState,
							overtime: currentState.overtime + 1,
						}),
					);

					if (currentState.overtime === 0) {
						const callback = yield* Ref.get(onTimerEndRef);
						yield* Option.match(callback, {
							onNone: () => Effect.void,
							onSome: (fn) => Effect.sync(fn),
						});
					}
				}
			});

		const startTicking = Effect.gen(function* () {
			const existingInterval = yield* Ref.get(intervalRef);
			yield* Option.match(existingInterval, {
				onNone: () => Effect.void,
				onSome: (id) => Effect.sync(() => clearInterval(id)),
			});

			const id = yield* Effect.sync(() =>
				setInterval(() => {
					Effect.runSync(tick());
				}, 1000),
			);

			yield* Ref.set(intervalRef, Option.some(id));
		});

		const stopTicking = Effect.gen(function* () {
			const existingInterval = yield* Ref.get(intervalRef);
			yield* Option.match(existingInterval, {
				onNone: () => Effect.void,
				onSome: (id) => Effect.sync(() => clearInterval(id)),
			});
			yield* Ref.set(intervalRef, Option.none());
		});

		const start = Effect.gen(function* () {
			const state = yield* SubscriptionRef.get(stateRef);

			if (state.phase === "idle") {
				yield* SubscriptionRef.set(
					stateRef,
					new TimerState({
						...state,
						phase: "focus",
						status: "running",
						remainingSeconds: state.config.focusDuration,
						overtime: 0,
					}),
				);
			} else {
				yield* SubscriptionRef.update(
					stateRef,
					(s) => new TimerState({ ...s, status: "running" }),
				);
			}

			yield* startTicking;
		});

		const pause = Effect.gen(function* () {
			yield* SubscriptionRef.update(
				stateRef,
				(state) => new TimerState({ ...state, status: "paused" }),
			);
			yield* stopTicking;
		});

		const reset = Effect.gen(function* () {
			yield* stopTicking;
			const state = yield* SubscriptionRef.get(stateRef);
			const duration =
				state.phase === "focus"
					? state.config.focusDuration
					: state.config.breakDuration;

			yield* SubscriptionRef.set(
				stateRef,
				new TimerState({
					...state,
					status: "stopped",
					remainingSeconds: duration,
					overtime: 0,
				}),
			);
		});

		const switchPhase = Effect.gen(function* () {
			yield* stopTicking;
			const state = yield* SubscriptionRef.get(stateRef);
			const newPhase: TimerPhase = state.phase === "focus" ? "break" : "focus";
			const duration =
				newPhase === "focus"
					? state.config.focusDuration
					: state.config.breakDuration;
			const newSessionCount =
				newPhase === "focus" ? state.sessionCount + 1 : state.sessionCount;

			yield* SubscriptionRef.set(
				stateRef,
				new TimerState({
					...state,
					phase: newPhase,
					status: "stopped",
					remainingSeconds: duration,
					overtime: 0,
					sessionCount: newSessionCount,
				}),
			);
		});

		const setConfig = (config: TimerConfig) =>
			Effect.gen(function* () {
				const state = yield* SubscriptionRef.get(stateRef);
				const duration =
					state.phase === "focus" || state.phase === "idle"
						? config.focusDuration
						: config.breakDuration;

				yield* SubscriptionRef.update(
					stateRef,
					(s) =>
						new TimerState({
							...s,
							config,
							remainingSeconds:
								s.status === "stopped" ? duration : s.remainingSeconds,
						}),
				);
			});

		const setOnTimerEnd = (callback: () => void) =>
			Ref.set(onTimerEndRef, Option.some(callback));

		const changes = stateRef.changes;

		return {
			state: stateRef,
			changes,
			start,
			pause,
			reset,
			switchPhase,
			setConfig,
			setOnTimerEnd,
		};
	}),
	accessors: true,
}) {}
