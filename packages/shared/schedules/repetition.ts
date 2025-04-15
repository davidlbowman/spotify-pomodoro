import { Effect, Schedule } from "effect";

export const policy = Schedule.addDelay(Schedule.recurs(2), () => 100);
