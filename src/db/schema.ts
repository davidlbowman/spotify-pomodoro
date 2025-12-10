/**
 * Database schema definitions for Drizzle ORM.
 *
 * @module
 */
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Pomodoros table - the central entity grouping focus + break.
 *
 * @since 0.2.0
 * @category Schemas
 */
export const pomodoros = sqliteTable("pomodoros", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	/** When the full pomodoro cycle (focus + break) was completed */
	completedAt: integer("completed_at", { mode: "timestamp_ms" }),
});

/**
 * Focus sessions table.
 *
 * @since 0.2.0
 * @category Schemas
 */
export const focusSessions = sqliteTable("focus_sessions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	pomodoroId: text("pomodoro_id")
		.notNull()
		.references(() => pomodoros.id),
	/** What they configured (e.g., 25 min = 1500 seconds) */
	configuredSeconds: integer("configured_seconds").notNull(),
	/** Actual time spent (could be less, equal, or more than configured) */
	elapsedSeconds: integer("elapsed_seconds").notNull().default(0),
	startedAt: integer("started_at", { mode: "timestamp_ms" }).notNull(),
	completedAt: integer("completed_at", { mode: "timestamp_ms" }),
	/** Whether user completed the session (vs abandoned/skipped) */
	completed: integer("completed", { mode: "boolean" }).notNull().default(false),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
});

/**
 * Break sessions table.
 *
 * @since 0.2.0
 * @category Schemas
 */
export const breakSessions = sqliteTable("break_sessions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	pomodoroId: text("pomodoro_id")
		.notNull()
		.references(() => pomodoros.id),
	/** What they configured (e.g., 5 min = 300 seconds) */
	configuredSeconds: integer("configured_seconds").notNull(),
	/** Actual time spent (could be less, equal, or more than configured) */
	elapsedSeconds: integer("elapsed_seconds").notNull().default(0),
	startedAt: integer("started_at", { mode: "timestamp_ms" }).notNull(),
	completedAt: integer("completed_at", { mode: "timestamp_ms" }),
	/** Whether user completed the session (vs abandoned/skipped) */
	completed: integer("completed", { mode: "boolean" }).notNull().default(false),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
});

/**
 * Type inference for pomodoro records.
 *
 * @since 0.2.0
 * @category Types
 */
export type Pomodoro = typeof pomodoros.$inferSelect;
export type NewPomodoro = typeof pomodoros.$inferInsert;

/**
 * Type inference for focus session records.
 *
 * @since 0.2.0
 * @category Types
 */
export type FocusSession = typeof focusSessions.$inferSelect;
export type NewFocusSession = typeof focusSessions.$inferInsert;

/**
 * Type inference for break session records.
 *
 * @since 0.2.0
 * @category Types
 */
export type BreakSession = typeof breakSessions.$inferSelect;
export type NewBreakSession = typeof breakSessions.$inferInsert;

/**
 * Helper to calculate overtime (derived, not stored).
 *
 * @since 0.2.0
 * @category Helpers
 */
export const getOvertime = (session: FocusSession | BreakSession) =>
	Math.max(0, session.elapsedSeconds - session.configuredSeconds);
