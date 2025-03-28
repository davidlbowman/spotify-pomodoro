export async function pausePlayback(token: string) {
	const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to pause playback");
	}
}
