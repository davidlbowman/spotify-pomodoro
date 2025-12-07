import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
	const [theme, setThemeState] = useState<Theme>(() => {
		if (typeof window === "undefined") return "dark";
		const stored = localStorage.getItem("lofi-pomodoro-theme") as Theme | null;
		if (stored) return stored;
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	});

	useEffect(() => {
		const root = document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("lofi-pomodoro-theme", theme);
	}, [theme]);

	const toggleTheme = useCallback(() => {
		setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
	}, []);

	const setTheme = useCallback((newTheme: Theme) => {
		setThemeState(newTheme);
	}, []);

	return { theme, toggleTheme, setTheme, isDark: theme === "dark" };
}
