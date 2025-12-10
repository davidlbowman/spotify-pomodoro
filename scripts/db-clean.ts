/**
 * Database cleanup script.
 *
 * Deletes all session data from the database.
 *
 * @module
 */
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Effect } from "effect";
import { breakSessions, focusSessions, pomodoros } from "../src/db/schema";

const program = Effect.gen(function* () {
	const sqlite = new Database("./data/pomodoro.db");
	const db = drizzle(sqlite);

	yield* Effect.log("Cleaning database...");

	yield* Effect.try(() => db.delete(breakSessions).run());
	yield* Effect.log("  ✓ Deleted break_sessions");

	yield* Effect.try(() => db.delete(focusSessions).run());
	yield* Effect.log("  ✓ Deleted focus_sessions");

	yield* Effect.try(() => db.delete(pomodoros).run());
	yield* Effect.log("  ✓ Deleted pomodoros");

	yield* Effect.try(() => sqlite.exec("VACUUM"));
	yield* Effect.log("  ✓ Vacuumed database");

	sqlite.close();
	yield* Effect.log("Database cleaned successfully!");
});

Effect.runPromise(program).catch(console.error);
