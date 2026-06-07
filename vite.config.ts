import path from "path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
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