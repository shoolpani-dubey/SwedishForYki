import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'favicon.svg'],
      devOptions: {
        // Expose the manifest and service worker during `npm run dev` so the
        // app can be installed and its PWA behavior can be tested locally.
        enabled: true,
        suppressWarnings: true,
      },
      manifest: {
        id: './',
        name: 'Swedish for YKI',
        short_name: 'Swedish YKI',
        description: 'Swedish lessons and practice for the YKI exam',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#f4f5f8',
        theme_color: '#f4f5f8',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the complete app shell, locally hosted font, icons, and the
        // emitted course JSON so every lesson works after the first visit.
        // Manifest icons and includeAssets are added by the PWA plugin.
        globPatterns: ['**/*.{js,css,html,json,woff,woff2}'],
      },
    }),
  ],
});
