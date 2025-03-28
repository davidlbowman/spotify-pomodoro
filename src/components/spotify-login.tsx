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
import {
	generateSpotifyAuthUrl,
	getTokenFromUrl,
	getUserPlaylists,
	isTokenValid,
} from "@/lib/spotify/auth";
import type { SpotifyTokenInfo } from "@/lib/spotify/types";
import { Loader2, LogIn, Music2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SpotifyLoginProps {
	onPlaylistSelect: (playlistId: string) => void;
}

export default function SpotifyLogin({ onPlaylistSelect }: SpotifyLoginProps) {
	const [token, setToken] = useState<SpotifyTokenInfo | null>(null);
	const [playlists, setPlaylists] = useState<
		Array<{
			id: string;
			name: string;
			images: Array<{ url: string }>;
			owner: { display_name: string };
		}>
	>([]);
	const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);

	useEffect(() => {
		const tokenFromUrl = getTokenFromUrl();
		if (tokenFromUrl && isTokenValid(tokenFromUrl)) {
			setToken(tokenFromUrl);
			setShowPlaylistDialog(true);
		}
	}, []);

	useEffect(() => {
		async function fetchPlaylists() {
			if (token?.accessToken) {
				setLoading(true);
				try {
					const response = await getUserPlaylists(token.accessToken);
					setPlaylists(response.items);
				} catch (error) {
					console.error("Failed to fetch playlists:", error);
				} finally {
					setLoading(false);
				}
			}
		}

		if (showPlaylistDialog) {
			void fetchPlaylists();
		}
	}, [token?.accessToken, showPlaylistDialog]);

	const handleLogin = () => {
		window.location.href = generateSpotifyAuthUrl();
	};

	const handlePlaylistSelect = (value: string) => {
		setSelectedPlaylist(value);
		setShowPlaylistDialog(false);
		localStorage.setItem("spotify_playlist_id", value);
		onPlaylistSelect(value);
	};

	if (!token || !isTokenValid(token)) {
		return (
			<Button onClick={handleLogin} variant="outline" size="sm">
				<LogIn className="w-4 h-4 mr-2" />
				Connect Spotify
			</Button>
		);
	}

	return (
		<>
			<Button
				onClick={() => setShowPlaylistDialog(true)}
				variant="outline"
				size="sm"
			>
				<Music2 className="w-4 h-4 mr-2" />
				Select Playlist
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
							value={selectedPlaylist}
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
