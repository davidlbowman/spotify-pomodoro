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
import { Effect } from "effect";
import { Loader2, Music2 } from "lucide-react";
import { useState } from "react";

const playlists = [
	{
		id: "1",
		name: "Playlist 1",
		owner: { display_name: "John Doe" },
	},
];

type AuthState = "unauthenticated" | "authenticating" | "authenticated";

export default function SpotifyLogin() {
	const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
	const [loading, setLoading] = useState(false);
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

	const handlePlaylistSelect = (playlistId: string) => {
		setSelectedPlaylist(playlistId);
	};

	const buttonConfig = {
		unauthenticated: {
			action: handleAuthorization,
			text: "Login to Spotify",
		},
		authenticating: {
			action: handleAuthentication,
			text: "Auth with Spotify",
		},
		authenticated: {
			action: () => console.log("clicked"),
			text: "Select Playlist",
		},
	};

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
					{loading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="w-6 h-6 animate-spin" />
						</div>
					) : (
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
