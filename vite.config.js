import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // base tells Vite where the app will be hosted.
  // GitHub Pages serves it at /terminal-navigering-KOF/ so all
  // asset paths need that prefix, otherwise images and JS won't load.
  base: '/terminal-navigering-KOF/',
  plugins: [
    react(),

    // VitePWA automatically generates a service worker and web manifest.
    // A service worker is a background script that caches files so the
    // app works even with spotty warehouse WiFi.
    VitePWA({
      registerType: 'autoUpdate',
      // autoUpdate means: when a new version is deployed, the service worker
      // updates quietly in the background and the user gets it on next visit.
      manifest: {
        name: 'Terminalnavigering KOF',
        short_name: 'Terminalen',
        description: 'Hitta rätt plats för pallar i kylen',
        theme_color: '#0057a8',
        background_color: '#f5f5f5',
        display: 'standalone',
        // standalone: hides the browser UI, looks like a native app
        // when added to the home screen on a phone
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Cache all these file types so the app works offline.
        globPatterns: ['**/*.{js,css,html,svg,json,png,ico}'],
      },
    }),
  ],
})
