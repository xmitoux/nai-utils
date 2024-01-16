import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json' assert { type: 'json' }; // Node >=17
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), crx({ manifest })],

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            port: 5173,
        },
    },
});
