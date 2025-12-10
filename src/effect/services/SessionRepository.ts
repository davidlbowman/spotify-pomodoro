/**
 * Repository service for session data persistence.
 *
 * @module
 */
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { Effect } from "effect";
import { breakSessions, focusSessions, pomodoros } from "../../db/schema";
import {
	BreakSessionNotFoundError,
	DatabaseError,
	FocusSessionNotFoundError,
	PomodoroNotFoundError,
} from "../errors/DatabaseError";
import type {
	BreakSession,
	CompleteSessionInput,
	CreateBreakSessionInput,
	CreateFocusSessionInput,
	FocusSession,
	Pomodoro,
	SessionStats,
} from "../schema/Session";

/**
 * Database client singleton for server-side operations.
 *
 * @since 0.2.0
 * @category Database
 */
const getDb = () => {
	const sqlite = new Database("./data/pomodoro.db");
	return drizzle(sqlite);
};

/**
 * Repository service for managing pomodoros and sessions.
 *
 * @since 0.2.0
 * @category Services
 */
export class SessionRepository extends Effect.Service<SessionRepository>()(
	"SessionRepository",
	{
		effect: Effect.gen(function* () {
			const db = getDb();

			const createPomodoro = Effect.tryPromise({
				try: async () => {
					const [result] = await db.insert(pomodoros).values({}).returning();
					return result as Pomodoro;
				},
				catch: (error) =>
					new DatabaseError({
						message: "Failed to create pomodoro",
						cause: error,
					}),
			});

			const getPomodoro = (id: string) =>
				Effect.tryPromise({
					try: async () => {
						const result = await db
							.select()
							.from(pomodoros)
							.where(eq(pomodoros.id, id))
							.limit(1);
						return result[0] as Pomodoro | undefined;
					},
					catch: (error) =>
						new DatabaseError({
							message: "Failed to get pomodoro",
							cause: error,
						}),
				}).pipe(
					Effect.flatMap((result) =>
						result
							? Effect.succeed(result)
							: Effect.fail(new PomodoroNotFoundError({ pomodoroId: id })),
					),
				);

			const completePomodoro = (id: string) =>
				Effect.tryPromise({
					try: async () => {
						const [result] = await db
							.update(pomodoros)
							.set({ completedAt: new Date() })
							.where(eq(pomodoros.id, id))
							.returning();
						return result as Pomodoro;
					},
					catch: (error) =>
						new DatabaseError({
							message: "Failed to complete pomodoro",
							cause: error,
						}),
				});

			const createFocusSession = (input: CreateFocusSessionInput) =>
				Effect.tryPromise({
					try: async () => {
						const [result] = await db
							.insert(focusSessions)
							.values({
								pomodoroId: input.pomodoroId,
								configuredSeconds: input.configuredSeconds,
								startedAt: new Date(),
							})
							.returning();
						return result as FocusSession;
					},
					catch: (error) =>
						new DatabaseError({
							message: "Failed to create focus session",
							cause: error,
						}),
				});

			const getFocusSession = (id: string) =>
				Effect.tryPromise({
					try: async () => {
						const result = await db
							.select()
							.from(focusSessions)
							.where(eq(focusSessions.id, id))
							.limit(1);
						return result[0] as FocusSession | undefined;
					},
					catch: (error) =>
						new DatabaseError({
							message: "Failed to get focus session",
							cause: error,
						}),
				}).pipe(
					Effect.flatMap((result) =>
						result
							? Effect.succeed(result)
							: Effect.fail(new FocusSessionNotFoundError({ sessionId: id })),
					),
				);

			const completeFocusSession = (id: string, input: CompleteSessionInput) =>
				Effect.tryPromise({
					try: async () => {
						const [result] = await db
							.update(focusSessions)
							.set({
								elapsedSeconds: input.elapsedSeconds,
								completedAt: new Date(),
								completed: true,
							})
							.where(eq(focusSessions.id, id))
							.returning();
						return result as FocusSession;
					},
					catch: (error) =>
						new DatabaseError({
							message: "Failed to complete focus session",
							cause: error,
						}),
				});

			const createBreakSession = (input: CreateBreakSessionInput) =>
				Effect.tryPromise({
					try: async () => {
						const [result] = await db
							.insert(breakSessions)
							.values({
								pomodoroId: input.pomodoroId,
								configuredSeconds: input.configuredSeconds,
								startedAt: new Date(),
							})
							.returning();
						return result as BreakSession;
					},
					catch: (error) =>
						new DatabaseError({
							message: "Failed to create break session",
							cause: error,
						}),
				});

			const getBreakSession = (id: string) =>
				Effect.tryPromise({
					try: async () => {
						const result = await db
							.select()
							.from(breakSessions)
							.where(eq(breakSessions.id, id))
							.limit(1);
						return result[0] as BreakSession | undefined;
					},
					catch: (error) =>
						new DatabaseError({
							message: "Failed to get break session",
							cause: error,
						}),
				}).pipe(
					Effect.flatMap((result) =>
						result
							? Effect.succeed(result)
							: Effect.fail(new BreakSessionNotFoundError({ sessionId: id })),
					),
				);

			const completeBreakSession = (id: string, input: CompleteSessionInput) =>
				Effect.tryPromise({
					try: async () => {
						const [result] = await db
							.update(breakSessions)
							.set({
								elapsedSeconds: input.elapsedSeconds,
								completedAt: new Date(),
								completed: true,
							})
							.where(eq(breakSessions.id, id))
							.returning();
						return result as BreakSession;
					},
					catch: (error) =>
						new DatabaseError({
							message: "Failed to complete break session",
							cause: error,
						}),
				});

			const getStats = Effect.tryPromise({
				try: async () => {
					const allPomodoros = await db.select().from(pomodoros);
					const allFocusSessions = await db.select().from(focusSessions);
					const allBreakSessions = await db.select().from(breakSessions);

					const completedFocus = allFocusSessions.filter((s) => s.completed);
					const completedBreak = allBreakSessions.filter((s) => s.completed);

					const totalFocusSeconds = completedFocus.reduce(
						(sum, s) => sum + s.elapsedSeconds,
						0,
					);
					const totalBreakSeconds = completedBreak.reduce(
						(sum, s) => sum + s.elapsedSeconds,
						0,
					);

					const totalFocusOvertimeSeconds = completedFocus.reduce(
						(sum, s) =>
							sum + Math.max(0, s.elapsedSeconds - s.configuredSeconds),
						0,
					);
					const totalBreakOvertimeSeconds = completedBreak.reduce(
						(sum, s) =>
							sum + Math.max(0, s.elapsedSeconds - s.configuredSeconds),
						0,
					);

					const now = new Date();
					const todayStart = new Date(
						now.getFullYear(),
						now.getMonth(),
						now.getDate(),
					);
					const weekStart = new Date(todayStart);
					weekStart.setDate(weekStart.getDate() - weekStart.getDay());

					const todayPomodoros = completedFocus.filter(
						(s) => s.completedAt && new Date(s.completedAt) >= todayStart,
					).length;

					const thisWeekPomodoros = completedFocus.filter(
						(s) => s.completedAt && new Date(s.completedAt) >= weekStart,
					).length;

					const focusDates = new Set(
						completedFocus.flatMap((s) => {
							if (!s.completedAt) return [];
							const d = new Date(s.completedAt);
							return [`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`];
						}),
					);

					let currentStreak = 0;
					let longestStreak = 0;
					const checkDate = new Date(todayStart);

					while (true) {
						const dateKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
						if (focusDates.has(dateKey)) {
							currentStreak++;
							checkDate.setDate(checkDate.getDate() - 1);
						} else {
							break;
						}
					}

					const sortedDates = Array.from(focusDates).sort();
					let tempStreak = 1;
					for (let i = 1; i < sortedDates.length; i++) {
						const prev = new Date(sortedDates[i - 1]);
						const curr = new Date(sortedDates[i]);
						const diffDays = Math.floor(
							(curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
						);
						if (diffDays === 1) {
							tempStreak++;
							longestStreak = Math.max(longestStreak, tempStreak);
						} else {
							tempStreak = 1;
						}
					}
					longestStreak = Math.max(
						longestStreak,
						currentStreak,
						focusDates.size > 0 ? 1 : 0,
					);

					return {
						totalPomodoros: allPomodoros.length,
						completedFocusSessions: completedFocus.length,
						completedBreakSessions: completedBreak.length,
						totalFocusSeconds,
						totalBreakSeconds,
						totalFocusOvertimeSeconds,
						totalBreakOvertimeSeconds,
						currentStreak,
						longestStreak,
						todayPomodoros,
						thisWeekPomodoros,
					} as SessionStats;
				},
				catch: (error) =>
					new DatabaseError({
						message: "Failed to get stats",
						cause: error,
					}),
			});

			return {
				createPomodoro,
				getPomodoro,
				completePomodoro,
				createFocusSession,
				getFocusSession,
				completeFocusSession,
				createBreakSession,
				getBreakSession,
				completeBreakSession,
				getStats,
			};
		}),
		accessors: true,
	},
) {}
