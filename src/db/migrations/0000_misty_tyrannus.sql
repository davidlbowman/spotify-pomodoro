CREATE TABLE `break_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`pomodoro_id` text NOT NULL,
	`configured_seconds` integer NOT NULL,
	`elapsed_seconds` integer DEFAULT 0 NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`pomodoro_id`) REFERENCES `pomodoros`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `focus_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`pomodoro_id` text NOT NULL,
	`configured_seconds` integer NOT NULL,
	`elapsed_seconds` integer DEFAULT 0 NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`pomodoro_id`) REFERENCES `pomodoros`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pomodoros` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`completed_at` integer
);
