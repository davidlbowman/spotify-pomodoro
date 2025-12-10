/**
 * SessionRepository service unit tests.
 *
 * @module
 */
import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";
import {
	BreakSessionNotFoundError,
	FocusSessionNotFoundError,
	PomodoroNotFoundError,
} from "@/effect/errors/DatabaseError";
import { SessionRepository } from "@/effect/services/SessionRepository";

describe("SessionRepository Service", () => {
	let testPomodoroId: string;
	let testFocusSessionId: string;
	let testBreakSessionId: string;

	describe("createPomodoro", () => {
		it.effect("creates a new pomodoro", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const pomodoro = yield* repo.createPomodoro;
				expect(pomodoro.id).toBeDefined();
				expect(typeof pomodoro.id).toBe("string");
				expect(pomodoro.createdAt).toBeInstanceOf(Date);
				expect(pomodoro.completedAt).toBeNull();
				testPomodoroId = pomodoro.id;
			}).pipe(Effect.provide(SessionRepository.Default)),
		);
	});

	describe("getPomodoro", () => {
		it.effect("retrieves an existing pomodoro", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const pomodoro = yield* repo.createPomodoro;
				const retrieved = yield* repo.getPomodoro(pomodoro.id);
				expect(retrieved.id).toBe(pomodoro.id);
			}).pipe(Effect.provide(SessionRepository.Default)),
		);

		it.effect("fails with PomodoroNotFoundError for non-existent id", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const result = yield* Effect.exit(
					repo.getPomodoro("non-existent-id-12345"),
				);
				expect(result._tag).toBe("Failure");
			}).pipe(Effect.provide(SessionRepository.Default)),
		);
	});

	describe("completePomodoro", () => {
		it.effect("marks a pomodoro as completed", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const pomodoro = yield* repo.createPomodoro;
				const completed = yield* repo.completePomodoro(pomodoro.id);
				expect(completed.completedAt).toBeInstanceOf(Date);
			}).pipe(Effect.provide(SessionRepository.Default)),
		);
	});

	describe("createFocusSession", () => {
		it.effect("creates a new focus session", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const pomodoro = yield* repo.createPomodoro;
				const focusSession = yield* repo.createFocusSession({
					pomodoroId: pomodoro.id,
					configuredSeconds: 1500,
				});
				expect(focusSession.id).toBeDefined();
				expect(focusSession.pomodoroId).toBe(pomodoro.id);
				expect(focusSession.configuredSeconds).toBe(1500);
				expect(focusSession.elapsedSeconds).toBe(0);
				expect(focusSession.completed).toBe(false);
				testFocusSessionId = focusSession.id;
			}).pipe(Effect.provide(SessionRepository.Default)),
		);
	});

	describe("getFocusSession", () => {
		it.effect("retrieves an existing focus session", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const pomodoro = yield* repo.createPomodoro;
				const focusSession = yield* repo.createFocusSession({
					pomodoroId: pomodoro.id,
					configuredSeconds: 1500,
				});
				const retrieved = yield* repo.getFocusSession(focusSession.id);
				expect(retrieved.id).toBe(focusSession.id);
			}).pipe(Effect.provide(SessionRepository.Default)),
		);

		it.effect("fails with FocusSessionNotFoundError for non-existent id", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const result = yield* Effect.exit(
					repo.getFocusSession("non-existent-id-12345"),
				);
				expect(result._tag).toBe("Failure");
			}).pipe(Effect.provide(SessionRepository.Default)),
		);
	});

	describe("completeFocusSession", () => {
		it.effect("marks a focus session as completed with elapsed time", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const pomodoro = yield* repo.createPomodoro;
				const focusSession = yield* repo.createFocusSession({
					pomodoroId: pomodoro.id,
					configuredSeconds: 1500,
				});
				const completed = yield* repo.completeFocusSession(focusSession.id, {
					elapsedSeconds: 1620,
				});
				expect(completed.elapsedSeconds).toBe(1620);
				expect(completed.completed).toBe(true);
				expect(completed.completedAt).toBeInstanceOf(Date);
			}).pipe(Effect.provide(SessionRepository.Default)),
		);

		it.effect("records overtime when elapsed > configured", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const pomodoro = yield* repo.createPomodoro;
				const focusSession = yield* repo.createFocusSession({
					pomodoroId: pomodoro.id,
					configuredSeconds: 1500,
				});
				const completed = yield* repo.completeFocusSession(focusSession.id, {
					elapsedSeconds: 1620,
				});
				const overtime = Math.max(
					0,
					completed.elapsedSeconds - completed.configuredSeconds,
				);
				expect(overtime).toBe(120);
			}).pipe(Effect.provide(SessionRepository.Default)),
		);
	});

	describe("createBreakSession", () => {
		it.effect("creates a new break session", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const pomodoro = yield* repo.createPomodoro;
				const breakSession = yield* repo.createBreakSession({
					pomodoroId: pomodoro.id,
					configuredSeconds: 300,
				});
				expect(breakSession.id).toBeDefined();
				expect(breakSession.pomodoroId).toBe(pomodoro.id);
				expect(breakSession.configuredSeconds).toBe(300);
				expect(breakSession.elapsedSeconds).toBe(0);
				expect(breakSession.completed).toBe(false);
				testBreakSessionId = breakSession.id;
			}).pipe(Effect.provide(SessionRepository.Default)),
		);
	});

	describe("getBreakSession", () => {
		it.effect("retrieves an existing break session", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const pomodoro = yield* repo.createPomodoro;
				const breakSession = yield* repo.createBreakSession({
					pomodoroId: pomodoro.id,
					configuredSeconds: 300,
				});
				const retrieved = yield* repo.getBreakSession(breakSession.id);
				expect(retrieved.id).toBe(breakSession.id);
			}).pipe(Effect.provide(SessionRepository.Default)),
		);

		it.effect("fails with BreakSessionNotFoundError for non-existent id", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const result = yield* Effect.exit(
					repo.getBreakSession("non-existent-id-12345"),
				);
				expect(result._tag).toBe("Failure");
			}).pipe(Effect.provide(SessionRepository.Default)),
		);
	});

	describe("completeBreakSession", () => {
		it.effect("marks a break session as completed with elapsed time", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const pomodoro = yield* repo.createPomodoro;
				const breakSession = yield* repo.createBreakSession({
					pomodoroId: pomodoro.id,
					configuredSeconds: 300,
				});
				const completed = yield* repo.completeBreakSession(breakSession.id, {
					elapsedSeconds: 320,
				});
				expect(completed.elapsedSeconds).toBe(320);
				expect(completed.completed).toBe(true);
				expect(completed.completedAt).toBeInstanceOf(Date);
			}).pipe(Effect.provide(SessionRepository.Default)),
		);
	});

	describe("getStats", () => {
		it.effect("returns session statistics", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const stats = yield* repo.getStats;
				expect(stats.totalPomodoros).toBeGreaterThanOrEqual(0);
				expect(stats.completedFocusSessions).toBeGreaterThanOrEqual(0);
				expect(stats.completedBreakSessions).toBeGreaterThanOrEqual(0);
				expect(stats.totalFocusSeconds).toBeGreaterThanOrEqual(0);
				expect(stats.totalBreakSeconds).toBeGreaterThanOrEqual(0);
				expect(stats.totalFocusOvertimeSeconds).toBeGreaterThanOrEqual(0);
				expect(stats.totalBreakOvertimeSeconds).toBeGreaterThanOrEqual(0);
				expect(stats.currentStreak).toBeGreaterThanOrEqual(0);
				expect(stats.longestStreak).toBeGreaterThanOrEqual(0);
				expect(stats.todayPomodoros).toBeGreaterThanOrEqual(0);
				expect(stats.thisWeekPomodoros).toBeGreaterThanOrEqual(0);
			}).pipe(Effect.provide(SessionRepository.Default)),
		);

		it.effect("calculates totals correctly after creating sessions", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;
				const statsBefore = yield* repo.getStats;

				const pomodoro = yield* repo.createPomodoro;
				const focusSession = yield* repo.createFocusSession({
					pomodoroId: pomodoro.id,
					configuredSeconds: 100,
				});
				yield* repo.completeFocusSession(focusSession.id, {
					elapsedSeconds: 120,
				});

				const statsAfter = yield* repo.getStats;
				expect(statsAfter.completedFocusSessions).toBe(
					statsBefore.completedFocusSessions + 1,
				);
				expect(statsAfter.totalFocusSeconds).toBe(
					statsBefore.totalFocusSeconds + 120,
				);
				expect(statsAfter.totalFocusOvertimeSeconds).toBe(
					statsBefore.totalFocusOvertimeSeconds + 20,
				);
			}).pipe(Effect.provide(SessionRepository.Default)),
		);
	});

	describe("full pomodoro cycle", () => {
		it.effect("records a complete pomodoro cycle", () =>
			Effect.gen(function* () {
				const repo = yield* SessionRepository;

				const pomodoro = yield* repo.createPomodoro;
				expect(pomodoro.completedAt).toBeNull();

				const focusSession = yield* repo.createFocusSession({
					pomodoroId: pomodoro.id,
					configuredSeconds: 1500,
				});
				const completedFocus = yield* repo.completeFocusSession(
					focusSession.id,
					{ elapsedSeconds: 1500 },
				);
				expect(completedFocus.completed).toBe(true);

				const breakSession = yield* repo.createBreakSession({
					pomodoroId: pomodoro.id,
					configuredSeconds: 300,
				});
				const completedBreak = yield* repo.completeBreakSession(
					breakSession.id,
					{ elapsedSeconds: 300 },
				);
				expect(completedBreak.completed).toBe(true);

				const completedPomodoro = yield* repo.completePomodoro(pomodoro.id);
				expect(completedPomodoro.completedAt).toBeInstanceOf(Date);
			}).pipe(Effect.provide(SessionRepository.Default)),
		);
	});
});
