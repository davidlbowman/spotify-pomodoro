/**
 * Stats dialog component for displaying session statistics.
 *
 * @module
 */
import { formatDuration, useStats } from "@/hooks/useStats";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

/**
 * Props for StatsDialog component.
 *
 * @since 0.2.0
 * @category Components
 */
interface StatsDialogProps {
	children: React.ReactNode;
}

/**
 * Dialog displaying pomodoro session statistics.
 *
 * @since 0.2.0
 * @category Components
 */
export function StatsDialog({ children }: StatsDialogProps) {
	const { stats, loading, error, refetch } = useStats();

	return (
		<Dialog onOpenChange={(open) => open && refetch()}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className={cn("bg-card/95 backdrop-blur-lg border-border", "max-w-md")}
			>
				<DialogHeader>
					<DialogTitle className="text-lg font-medium tracking-wide">
						Statistics
					</DialogTitle>
				</DialogHeader>

				{loading && (
					<div className="py-8 text-center text-muted-foreground">
						Loading...
					</div>
				)}

				{error && <div className="py-8 text-center text-red-500">{error}</div>}

				{stats && !loading && (
					<div className="space-y-4">
						<div className="grid grid-cols-3 gap-3">
							<StatCard
								label="Pomodoros"
								value={stats.completedFocusSessions}
								sublabel="completed"
							/>
							<StatCard
								label="Today"
								value={stats.todayPomodoros}
								sublabel="sessions"
							/>
							<StatCard
								label="Streak"
								value={stats.currentStreak}
								sublabel={`best: ${stats.longestStreak}`}
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<StatCard
								label="Focus Time"
								value={formatDuration(stats.totalFocusSeconds)}
								sublabel={
									stats.totalFocusOvertimeSeconds > 0
										? `+${formatDuration(stats.totalFocusOvertimeSeconds)} overtime`
										: "no overtime"
								}
								large
							/>
							<StatCard
								label="Break Time"
								value={formatDuration(stats.totalBreakSeconds)}
								sublabel={
									stats.totalBreakOvertimeSeconds > 0
										? `+${formatDuration(stats.totalBreakOvertimeSeconds)} overtime`
										: "no overtime"
								}
								large
							/>
						</div>

						<div className="pt-2 text-center text-xs text-muted-foreground/50">
							{stats.thisWeekPomodoros} sessions this week
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

/**
 * Props for StatCard component.
 *
 * @since 0.2.0
 * @category Components
 */
interface StatCardProps {
	label: string;
	value: string | number;
	sublabel?: string;
	large?: boolean;
}

/**
 * Individual stat card for displaying a metric.
 *
 * @since 0.2.0
 * @category Components
 */
function StatCard({ label, value, sublabel, large }: StatCardProps) {
	return (
		<div
			className={cn(
				"rounded-xl bg-secondary/30 border border-border/50 p-3",
				"text-center",
			)}
		>
			<div className="text-xs text-muted-foreground/70 uppercase tracking-wide mb-1">
				{label}
			</div>
			<div
				className={cn(
					"font-mono font-semibold",
					large ? "text-xl" : "text-2xl",
				)}
			>
				{value}
			</div>
			{sublabel && (
				<div className="text-xs text-muted-foreground/50 mt-0.5">
					{sublabel}
				</div>
			)}
		</div>
	);
}
