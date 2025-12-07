/**
 * Timer settings card component.
 *
 * @module
 */

import { useState } from "react";
import { useTimer } from "../hooks/useTimer";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

/**
 * Card for configuring focus and break durations.
 *
 * @since 0.0.1
 * @category Components
 */
export function TimerSettings() {
	const { state, setConfig } = useTimer();
	const [focusMinutes, setFocusMinutes] = useState(
		state ? Math.floor(state.config.focusDuration / 60) : 25,
	);
	const [breakMinutes, setBreakMinutes] = useState(
		state ? Math.floor(state.config.breakDuration / 60) : 5,
	);

	const handleSave = () => {
		setConfig(focusMinutes, breakMinutes);
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-lg">Timer Settings</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="focus">Focus (minutes)</Label>
						<Input
							id="focus"
							type="number"
							min={1}
							max={120}
							value={focusMinutes}
							onChange={(e) => setFocusMinutes(Number(e.target.value))}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="break">Break (minutes)</Label>
						<Input
							id="break"
							type="number"
							min={1}
							max={60}
							value={breakMinutes}
							onChange={(e) => setBreakMinutes(Number(e.target.value))}
						/>
					</div>
				</div>
				<Button onClick={handleSave} className="w-full">
					Save Settings
				</Button>
			</CardContent>
		</Card>
	);
}
