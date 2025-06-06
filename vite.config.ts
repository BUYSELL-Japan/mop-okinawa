import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'mask-icon.svg'
      ],
      manifest: {
        name: 'MOP-Okinawa',
        short_name: 'MOP-Okinawa',
        description: 'Plan your perfect Okinawa trip like a local. Discover hidden gems, authentic experiences, and top spots with MOP – your ultimate travel companion.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/?source=pwa',
        id: '/?version=1.0.1',
        orientation: 'portrait',
        categories: ['travel', 'navigation', 'maps'],
        lang: 'ja',
        dir: 'ltr',
        prefer_related_applications: false,
        shortcuts: [
          {
            name: '観光スポット',
            url: '/?category=1',
            icons: [{ src: 'https://s3geojsonnew.s3.ap-southeast-2.amazonaws.com/PWAアイコン/mop192beta.png', sizes: '192x192' }]
          },
          {
            name: 'アクティビティ',
            url: '/?category=2',
            icons: [{ src: 'https://s3geojsonnew.s3.ap-southeast-2.amazonaws.com/PWAアイコン/mop192beta.png', sizes: '192x192' }]
          }
        ],
        screenshots: [
          {
            src: 'https://s3geojsonnew.s3.ap-southeast-2.amazonaws.com/PWAアイコン/scrshot.png',
            sizes: '640x1136',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'MOP-Okinawa'
          }
        ],
        icons: [
          {
            src: 'https://s3geojsonnew.s3.ap-southeast-2.amazonaws.com/PWAアイコン/mop192beta.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://s3geojsonnew.s3.ap-southeast-2.amazonaws.com/PWAアイコン/mop512beta.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'https://s3geojsonnew.s3.ap-southeast-2.amazonaws.com/PWAアイコン/mop512beta.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/s3geojsonnew\.s3\.ap-southeast-2\.amazonaws\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'geojson-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /^https:\/\/.*\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles-cache',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'leaflet', 'react-leaflet'],
        },
      },
    },
  },
  server: {
    headers: {
      'Cache-Control': 'no-store',
    },
  },
});