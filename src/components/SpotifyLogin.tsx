/**
 * Spotify login card component.
 *
 * @module
 */

import { useSpotifyAuth } from "../hooks/useSpotify";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

/**
 * Card for Spotify authentication status and login/logout.
 *
 * @since 0.0.1
 * @category Components
 */
export function SpotifyLogin() {
	const { isAuthenticated, isLoading, login, logout } = useSpotifyAuth();

	if (isLoading) {
		return (
			<Card className="w-full max-w-md">
				<CardContent className="p-8">
					<div className="text-center text-muted-foreground">
						Checking authentication...
					</div>
				</CardContent>
			</Card>
		);
	}

	if (isAuthenticated) {
		return (
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<span className="text-green-500">●</span>
						Connected to Spotify
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Button onClick={logout} variant="outline" className="w-full">
						Disconnect
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-lg">Connect Spotify</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground mb-4">
					Connect your Spotify account to play music during your pomodoro
					sessions.
				</p>
				<Button
					onClick={login}
					className="w-full bg-[#1DB954] hover:bg-[#1ed760]"
				>
					Connect with Spotify
				</Button>
			</CardContent>
		</Card>
	);
}
