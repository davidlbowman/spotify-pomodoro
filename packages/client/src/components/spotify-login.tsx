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
import { Loader2, Music2 } from "lucide-react";
import { useState } from "react";

const playlists = [
	{
		id: "1",
		name: "Playlist 1",
		owner: { display_name: "John Doe" },
	},
];

export default function SpotifyLogin() {
	const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

	const handlePlaylistSelect = (playlistId: string) => {
		setSelectedPlaylist(playlistId);
	};

	return (
		<>
			<Button
				onClick={() => setShowPlaylistDialog(true)}
				variant="outline"
				size="sm"
			>
				<Music2 className="w-4 h-4 mr-2" />
				Login with Spotify
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
