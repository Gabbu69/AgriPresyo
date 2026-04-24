import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Increase warning limit since we know about the monolith
        chunkSizeWarningLimit: 600,
        rollupOptions: {
          output: {
            manualChunks: {
              // Core framework — cached long-term, rarely changes
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              // Supabase auth + client — large but stable
              'vendor-supabase': ['@supabase/supabase-js'],
              // Charting library — only needed on stats/market pages
              'vendor-charts': ['recharts'],
              // PDF generation — only needed on demand (download button)
              'vendor-pdf': ['jspdf', 'jspdf-autotable'],
              // i18n — small but separate for caching
              'vendor-i18n': ['i18next', 'react-i18next'],
            },
          },
        },
      },
    };
});
