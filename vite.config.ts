import path from "path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: true, // позволяет открывать через IP по Wi-Fi
	},
	plugins: [
		tanstackRouter({
			routesDirectory: "./src/routes",
			generatedRouteTree: "./src/routeTree.gen.ts",
			target: "react",
			autoCodeSplitting: true,
		}),
		react(),
		VitePWA({
			registerType: "prompt",
			includeAssets: ["favicon.svg", "apple-touch-icon.png", "maskable-icon.png"],
			manifest: {
				name: "VIP Burger",
				short_name: "VIP Burger",
				description: "VIP Burger Warehouse & Management System",
				theme_color: "#4f46e5",
				background_color: "#f8fafc",
				display: "standalone",
				start_url: "/",
				icons: [
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "maskable-icon.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
				cleanupOutdatedCaches: true,
			},
			devOptions: {
				enabled: true,
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						if (id.includes('antd')) return 'vendor-antd';
						if (id.includes('lucide-react')) return 'vendor-icons';
						return 'vendor';
					}
				},
			},
		},
	},
})