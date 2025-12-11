/**
 * Auth service unit tests.
 *
 * @module
 */
import { afterEach, beforeEach, describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";
import {
	AuthConfigError,
	InvalidAuthCookieError,
	InvalidCredentialsError,
} from "@/effect/errors/AuthError";
import { Auth } from "@/effect/services/Auth";

describe("Auth Service", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		process.env.AUTH_ENABLED = "false";
		process.env.AUTH_PASSWORD = "";
		process.env.AUTH_SECRET = "";
	});

	afterEach(() => {
		process.env = { ...originalEnv };
	});

	describe("isEnabled", () => {
		it.effect("returns false when AUTH_ENABLED is not set", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "";
				const enabled = yield* Auth.isEnabled;
				expect(enabled).toBe(false);
			}).pipe(Effect.provide(Auth.Default)),
		);

		it.effect("returns false when AUTH_ENABLED is 'false'", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "false";
				const enabled = yield* Auth.isEnabled;
				expect(enabled).toBe(false);
			}).pipe(Effect.provide(Auth.Default)),
		);

		it.effect("returns true when AUTH_ENABLED is 'true'", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "true";
				const enabled = yield* Auth.isEnabled;
				expect(enabled).toBe(true);
			}).pipe(Effect.provide(Auth.Default)),
		);
	});

	describe("getConfig", () => {
		it.effect("fails when auth enabled but password missing", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "true";
				process.env.AUTH_PASSWORD = "";
				process.env.AUTH_SECRET = "testsecret12345678901234567890";
				const result = yield* Effect.either(Auth.getConfig);
				expect(result._tag).toBe("Left");
				if (result._tag === "Left") {
					expect(result.left).toBeInstanceOf(AuthConfigError);
				}
			}).pipe(Effect.provide(Auth.Default)),
		);

		it.effect("fails when auth enabled but secret missing", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "true";
				process.env.AUTH_PASSWORD = "testpass";
				process.env.AUTH_SECRET = "";
				const result = yield* Effect.either(Auth.getConfig);
				expect(result._tag).toBe("Left");
			}).pipe(Effect.provide(Auth.Default)),
		);

		it.effect("succeeds when auth enabled with valid config", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "true";
				process.env.AUTH_PASSWORD = "testpass";
				process.env.AUTH_SECRET = "testsecret12345678901234567890";
				const config = yield* Auth.getConfig;
				expect(config.password).toBe("testpass");
				expect(config.enabled).toBe(true);
			}).pipe(Effect.provide(Auth.Default)),
		);

		it.effect("succeeds when auth disabled regardless of config", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "false";
				process.env.AUTH_PASSWORD = "";
				process.env.AUTH_SECRET = "";
				const config = yield* Auth.getConfig;
				expect(config.enabled).toBe(false);
			}).pipe(Effect.provide(Auth.Default)),
		);
	});

	describe("validateCredentials", () => {
		it.effect("succeeds with correct credentials", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "true";
				process.env.AUTH_PASSWORD = "correctpassword";
				process.env.AUTH_SECRET = "testsecret12345678901234567890";
				const result = yield* Auth.validateCredentials(
					"admin",
					"correctpassword",
				);
				expect(result).toBe(true);
			}).pipe(Effect.provide(Auth.Default)),
		);

		it.effect("fails with wrong username", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "true";
				process.env.AUTH_PASSWORD = "correctpassword";
				process.env.AUTH_SECRET = "testsecret12345678901234567890";
				const result = yield* Effect.either(
					Auth.validateCredentials("wronguser", "correctpassword"),
				);
				expect(result._tag).toBe("Left");
				if (result._tag === "Left") {
					expect(result.left).toBeInstanceOf(InvalidCredentialsError);
				}
			}).pipe(Effect.provide(Auth.Default)),
		);

		it.effect("fails with wrong password", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "true";
				process.env.AUTH_PASSWORD = "correctpassword";
				process.env.AUTH_SECRET = "testsecret12345678901234567890";
				const result = yield* Effect.either(
					Auth.validateCredentials("admin", "wrongpassword"),
				);
				expect(result._tag).toBe("Left");
				if (result._tag === "Left") {
					expect(result.left).toBeInstanceOf(InvalidCredentialsError);
				}
			}).pipe(Effect.provide(Auth.Default)),
		);
	});

	describe("createCookie and verifyCookie", () => {
		it.effect("creates a valid cookie that can be verified", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "true";
				process.env.AUTH_PASSWORD = "testpass";
				process.env.AUTH_SECRET = "testsecret12345678901234567890";
				const cookie = yield* Auth.createCookie("admin");
				const payload = yield* Auth.verifyCookie(cookie);
				expect(payload.username).toBe("admin");
				expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
			}).pipe(Effect.provide(Auth.Default)),
		);

		it.effect("fails to verify tampered cookie", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "true";
				process.env.AUTH_PASSWORD = "testpass";
				process.env.AUTH_SECRET = "testsecret12345678901234567890";
				const cookie = yield* Auth.createCookie("admin");
				const tamperedCookie = `${cookie}tampered`;
				const result = yield* Effect.either(Auth.verifyCookie(tamperedCookie));
				expect(result._tag).toBe("Left");
				if (result._tag === "Left") {
					expect(result.left).toBeInstanceOf(InvalidAuthCookieError);
				}
			}).pipe(Effect.provide(Auth.Default)),
		);

		it.effect("fails to verify malformed cookie", () =>
			Effect.gen(function* () {
				process.env.AUTH_ENABLED = "true";
				process.env.AUTH_PASSWORD = "testpass";
				process.env.AUTH_SECRET = "testsecret12345678901234567890";
				const result = yield* Effect.either(Auth.verifyCookie("not-a-cookie"));
				expect(result._tag).toBe("Left");
			}).pipe(Effect.provide(Auth.Default)),
		);
	});
});
