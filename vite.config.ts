import react from '@vitejs/plugin-react'
import * as path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			includeAssets: ['**/*.{png}', '**/*.{jpg}'],

			registerType: 'autoUpdate',
			injectRegister: false,

			pwaAssets: {
				disabled: false,
				config: true,
			},

			manifest: {
				name: 'RedStone',
				short_name: 'RedStone',
				description: 'Best card game',
				theme_color: '#46B4AC',
				background_color: '#46B4AC',
				display: 'standalone',
				orientation: 'landscape-primary',
				icons: [
					{
						src: '/favicons/192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/favicons/512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: '/favicons/192x192.jpg',
						sizes: '192x192',
						type: 'image/jpg',
						purpose: 'maskable',
					},
					{
						src: '/assets/favicons/512x512.jpg',
						sizes: '512x512',
						type: 'image/jpg',
						purpose: 'maskable',
					},
				],
			},

			workbox: {
				globPatterns: ['**/*.{js,css,scss,html,svg,png,ico}'],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
			},

			devOptions: {
				enabled: true,
				navigateFallback: 'index.html',
				suppressWarnings: true,
				type: 'module',
			},
		}),
	],
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
	},
	assetsInclude: ['**/*.gif'],
})
