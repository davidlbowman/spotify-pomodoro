const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
console.log(SPOTIFY_CLIENT_ID);
const SPOTIFY_REDIRECT_URI = import.meta.env
	.VITE_SPOTIFY_REDIRECT_URI as string;
console.log(SPOTIFY_REDIRECT_URI);
const SCOPES = [
	"user-read-playback-state",
	"user-modify-playback-state",
	"playlist-read-private",
	"playlist-read-collaborative",
];

export function generateSpotifyAuthUrl(): string {
	const state = Math.random().toString(36).substring(7);
	localStorage.setItem("spotify_auth_state", state);

	const params = new URLSearchParams({
		client_id: SPOTIFY_CLIENT_ID,
		response_type: "token",
		redirect_uri: SPOTIFY_REDIRECT_URI,
		state: state,
		scope: SCOPES.join(" "),
	});

	return `https://accounts.spotify.com/authorize?${params.toString()}`;
}
