import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	server: {
		port: 2500,
	},
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [react()],
});
