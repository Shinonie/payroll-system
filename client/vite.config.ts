import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pluginRewriteAll from 'vite-plugin-rewrite-all';

export default defineConfig({
    plugins: [react(), pluginRewriteAll()],
    resolve: {
        alias: [{ find: '@', replacement: resolve(__dirname, './src') }]
    },
    server: {
        port: 4000,
        proxy: {
            '/api': {
                target: 'http://localhost:6000',
                changeOrigin: true
            }
        }
    }
});
