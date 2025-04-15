import { Effect } from "effect";

export const getAuthorizationURL = () =>
	Effect.gen(function* () {
		const authorizationUrl = yield* Effect.sync(() => {
			const params = new URLSearchParams();
			params.append("response_type", "code");
			params.append("client_id", "b9a43f1ecd77436cbcd64bbcc00190a4");
			params.append("redirect_uri", "http://localhost:5173/");
			params.append("scope", "playlist-read-private");
			return `https://accounts.spotify.com/authorize?${params.toString()}`;
		});

		return authorizationUrl;
	});
