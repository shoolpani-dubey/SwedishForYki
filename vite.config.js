import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'favicon.svg'],
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
        // The course content is emitted as a 1.5 MB JSON asset, so include it
        // explicitly to make lessons available without a connection.
        globPatterns: ['**/*.{js,css,html,json,ico,woff2}'],
      },
    }),
  ],
});
