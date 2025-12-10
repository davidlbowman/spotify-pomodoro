/**
 * React hook for automatic session recording.
 *
 * @module
 */
import { useCallback, useRef } from "react";
import type { TimerState } from "@/effect/schema/TimerState";
import {
	completeBreakSession,
	completeFocusSession,
	completePomodoro,
	createBreakSession,
	createFocusSession,
	createPomodoro,
} from "@/lib/sessionApi";

/**
 * Hook for recording pomodoro sessions to the database.
 *
 * Call `onPhaseStart` when starting a new phase and `onPhaseEnd` when ending.
 * The hook manages the lifecycle of pomodoros and sessions automatically.
 *
 * @since 0.2.0
 * @category Hooks
 */
export function useSessionRecording() {
	const pomodoroIdRef = useRef<string | null>(null);
	const focusSessionIdRef = useRef<string | null>(null);
	const breakSessionIdRef = useRef<string | null>(null);

	/**
	 * Called when starting a new phase.
	 * Creates the necessary database records.
	 */
	const onPhaseStart = useCallback(async (state: TimerState) => {
		try {
			if (state.phase === "focus") {
				if (!pomodoroIdRef.current) {
					const pomodoro = await createPomodoro();
					pomodoroIdRef.current = pomodoro.id;
				}

				const focusSession = await createFocusSession(
					pomodoroIdRef.current,
					state.config.focusDuration,
				);
				focusSessionIdRef.current = focusSession.id;
				breakSessionIdRef.current = null;
			} else if (state.phase === "break" && pomodoroIdRef.current) {
				const breakSession = await createBreakSession(
					pomodoroIdRef.current,
					state.config.breakDuration,
				);
				breakSessionIdRef.current = breakSession.id;
				focusSessionIdRef.current = null;
			}
		} catch (error) {
			console.error("Failed to record session start:", error);
		}
	}, []);

	/**
	 * Called when ending the current phase.
	 * Records the elapsed time and marks the session as complete.
	 */
	const onPhaseEnd = useCallback(
		async (state: TimerState, switchingToNext: boolean) => {
			try {
				const elapsedSeconds = state.totalElapsedSeconds;

				if (state.phase === "focus" && focusSessionIdRef.current) {
					await completeFocusSession(focusSessionIdRef.current, elapsedSeconds);
					focusSessionIdRef.current = null;
				} else if (state.phase === "break" && breakSessionIdRef.current) {
					await completeBreakSession(breakSessionIdRef.current, elapsedSeconds);
					breakSessionIdRef.current = null;

					if (pomodoroIdRef.current && !switchingToNext) {
						await completePomodoro(pomodoroIdRef.current);
						pomodoroIdRef.current = null;
					}
				}

				if (switchingToNext && state.phase === "break") {
					pomodoroIdRef.current = null;
				}
			} catch (error) {
				console.error("Failed to record session end:", error);
			}
		},
		[],
	);

	/**
	 * Reset all tracking state (for when user resets timer completely).
	 */
	const reset = useCallback(() => {
		pomodoroIdRef.current = null;
		focusSessionIdRef.current = null;
		breakSessionIdRef.current = null;
	}, []);

	return {
		onPhaseStart,
		onPhaseEnd,
		reset,
		pomodoroId: pomodoroIdRef.current,
		focusSessionId: focusSessionIdRef.current,
		breakSessionId: breakSessionIdRef.current,
	};
}
