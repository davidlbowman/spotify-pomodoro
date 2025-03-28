import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import type React from "react";

const SpotifyLogin: React.FC = () => {
	const handleLogin = () => {
		// Implement Spotify login logic here
		console.log("Logging in to Spotify");
	};

	return (
		<Button
			onClick={handleLogin}
			variant="outline"
			className="bg-white/20 backdrop-blur-sm"
		>
			<Music className="mr-2 h-4 w-4" /> Connect Spotify
		</Button>
	);
};

export default SpotifyLogin;
