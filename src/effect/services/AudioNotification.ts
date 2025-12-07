/**
 * Audio notification service using Web Audio API.
 *
 * @module
 */

import { Effect, Option, Ref } from "effect";

/**
 * Audio notification service.
 *
 * Plays synthesized chime sounds for timer events.
 *
 * @since 0.0.1
 * @category Services
 */
export class AudioNotification extends Effect.Service<AudioNotification>()(
	"AudioNotification",
	{
		effect: Effect.gen(function* () {
			const audioContextRef = yield* Ref.make<Option.Option<AudioContext>>(
				Option.none(),
			);

			const init = Effect.gen(function* () {
				const ctx = yield* Effect.sync(() => new AudioContext());
				yield* Ref.set(audioContextRef, Option.some(ctx));
			});

			const play = Effect.gen(function* () {
				const maybeCtx = yield* Ref.get(audioContextRef);
				yield* Option.match(maybeCtx, {
					onNone: () => Effect.void,
					onSome: (ctx) =>
						Effect.sync(() => {
							if (ctx.state === "suspended") {
								ctx.resume();
							}

							const oscillator = ctx.createOscillator();
							const gainNode = ctx.createGain();

							oscillator.connect(gainNode);
							gainNode.connect(ctx.destination);

							const now = ctx.currentTime;

							oscillator.frequency.setValueAtTime(880, now);
							oscillator.frequency.setValueAtTime(660, now + 0.15);

							gainNode.gain.setValueAtTime(0, now);
							gainNode.gain.linearRampToValueAtTime(0.9, now + 0.02);
							gainNode.gain.linearRampToValueAtTime(0.6, now + 0.15);
							gainNode.gain.linearRampToValueAtTime(0.9, now + 0.17);
							gainNode.gain.linearRampToValueAtTime(0, now + 0.4);

							oscillator.start(now);
							oscillator.stop(now + 0.4);
						}),
				});
			});

			return {
				init,
				play,
			};
		}),
		accessors: true,
	},
) {}
