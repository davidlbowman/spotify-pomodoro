import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getAccessToken } from "@/lib/spotify/getAccessToken";
import { getAuthorizationURL } from "@/lib/spotify/getAuthorizationUrl";
import { getCurrentUsersPlaylists } from "@/lib/spotify/getCurrentUsersPlaylists";
import { Effect } from "effect";
import { Music2 } from "lucide-react";
import { useState } from "react";
import type { PlayListItems } from "../../../shared/types/spotify";

type AuthState = "unauthenticated" | "authenticating" | "authenticated";

export default function SpotifyLogin() {
	const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
	const [playlists, setPlaylists] = useState<PlayListItems[] | null>(null);
	const [authState, setAuthState] = useState<AuthState>("unauthenticated");
	const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get("code");
	if (code) {
		localStorage.setItem("code", code);
		setAuthState("authenticating");
		window.history.replaceState({}, "", window.location.pathname);
	}

	const handleAuthorization = () => {
		const authorizationUrl = Effect.runSync(getAuthorizationURL());
		window.location.href = authorizationUrl;
	};

	const handleAuthentication = async () => {
		const code = localStorage.getItem("code") || "broken";
		const accessToken = await Effect.runPromise(getAccessToken({ code }));
		if (accessToken) {
			localStorage.setItem("spotify_access_token", accessToken.access_token);
			setAuthState("authenticated");
		}
	};

	const handleSelectPlaylist = async () => {
		const token = localStorage.getItem("spotify_access_token") || "broken";
		const playlists = await Effect.runPromise(
			getCurrentUsersPlaylists({
				access_token: token,
			}),
		);
		setPlaylists([...playlists]);
		setShowPlaylistDialog(true);
	};

	const handlePlaylistSelect = (playlistId: string) => {
		setSelectedPlaylist(playlistId);
	};

	const buttonConfig: Record<AuthState, { text: string; action: () => void }> =
		{
			unauthenticated: {
				text: "Login to Spotify",
				action: handleAuthorization,
			},
			authenticating: {
				text: "Auth with Spotify",
				action: handleAuthentication,
			},
			authenticated: {
				text: "Select Playlist",
				action: handleSelectPlaylist,
			},
		};

	console.log(authState);

	return (
		<>
			<Button
				onClick={buttonConfig[authState].action}
				variant="outline"
				size="sm"
			>
				<Music2 className="w-4 h-4 mr-2" />
				{buttonConfig[authState].text}
			</Button>

			<Dialog open={showPlaylistDialog} onOpenChange={setShowPlaylistDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Choose a Playlist</DialogTitle>
					</DialogHeader>
					{playlists && (
						<Select
							value={selectedPlaylist ?? undefined}
							onValueChange={handlePlaylistSelect}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a playlist" />
							</SelectTrigger>
							<SelectContent>
								{playlists.map((playlist) => (
									<SelectItem key={playlist.id} value={playlist.id}>
										{playlist.name} - by {playlist.owner.display_name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
