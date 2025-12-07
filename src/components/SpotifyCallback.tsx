import { useEffect, useState } from "react";
import { useSpotifyAuth } from "../hooks/useSpotify";

export function SpotifyCallback() {
	const { handleCallback } = useSpotifyAuth();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		const state = params.get("state");
		const errorParam = params.get("error");

		if (errorParam) {
			setError(`Spotify authorization failed: ${errorParam}`);
			return;
		}

		if (!code || !state) {
			setError("Missing authorization code or state");
			return;
		}

		handleCallback(code, state)
			.then(() => {
				window.location.href = "/";
			})
			.catch((e) => {
				setError(
					e instanceof Error ? e.message : "Failed to complete authentication",
				);
			});
	}, [handleCallback]);

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 mb-4">{error}</div>
					<a href="/" className="text-primary underline">
						Return home
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<div className="text-lg mb-2">Connecting to Spotify...</div>
				<div className="text-muted-foreground">Please wait</div>
			</div>
		</div>
	);
}
