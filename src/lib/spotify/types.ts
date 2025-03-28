export interface SpotifyAuthResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	state: string;
}

export interface SpotifyTokenInfo {
	accessToken: string;
	expiresAt: number;
}

export interface SpotifyPlaylist {
	id: string;
	name: string;
	images: { url: string }[];
	owner: {
		display_name: string;
	};
}
