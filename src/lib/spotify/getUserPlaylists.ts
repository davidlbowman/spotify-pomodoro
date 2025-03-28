export async function getUserPlaylists(token: string) {
	const response = await fetch("https://api.spotify.com/v1/me/playlists", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch playlists");
	}

	return response.json() as Promise<{
		items: Array<{
			id: string;
			name: string;
			images: Array<{ url: string }>;
			owner: { display_name: string };
		}>;
	}>;
}
