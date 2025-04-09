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
import { getAuthorizationURL } from "@/lib/spotify/getAuthorizationUrl";
import { Effect } from "effect";
import { Loader2, Music2 } from "lucide-react";
import { useEffect, useState } from "react";

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
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");
		if (code) {
			setAuthState("authenticating");
			fetch("http://localhost:3000/api/spotify/requestAccessToken", {
				method: "POST",
				body: JSON.stringify({ code }),
			})
				.then((res) => res.json())
				.then((token) => {
					setAccessToken(token.access_token);
					setAuthState("authenticated");
					window.history.replaceState({}, "", window.location.pathname);
				})
				.catch(() => setAuthState("unauthenticated"));
		}
	}, []);

	const handleAuthorization = () => {
		const authorizationUrl = Effect.runSync(getAuthorizationURL());
		window.location.href = authorizationUrl;
	};

	const handlePlaylistSelect = (playlistId: string) => {
		setSelectedPlaylist(playlistId);
	};

	return (
		<>
			<Button onClick={() => handleAuthorization()} variant="outline" size="sm">
				<Music2 className="w-4 h-4 mr-2" />
				{authState === "unauthenticated"
					? "Login with Spotify"
					: "Select Playlist"}
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
