import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [{ find: '@', replacement: resolve(__dirname, './src') }]
    },
    server: {
        port: 3000
    }
});
