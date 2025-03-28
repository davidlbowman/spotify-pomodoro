import type React from "react";

interface PomodoroTimerProps {
	time: number;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ time }) => {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	return (
		<div className="text-8xl font-bold">
			{minutes.toString().padStart(2, "0")}:
			{seconds.toString().padStart(2, "0")}
		</div>
	);
};

export default PomodoroTimer;
