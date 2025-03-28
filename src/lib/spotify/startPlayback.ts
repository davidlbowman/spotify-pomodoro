export async function startPlayback(token: string, playlistId: string) {
	const response = await fetch("https://api.spotify.com/v1/me/player/play", {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			context_uri: `spotify:playlist:${playlistId}`,
			position_ms: 0,
		}),
	});

	if (!response.ok) {
		throw new Error("Failed to start playback");
	}
}
