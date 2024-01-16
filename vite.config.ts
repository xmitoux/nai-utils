import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import path from 'path';
import { manifest } from './manifest.config';

// https://vitejs.dev/config/
export default ({ mode }) => {
    const isProd = mode === 'production';

    return defineConfig({
        plugins: [vue(), crx({ manifest })],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        build: {
            // 開発時はminifyしない
            minify: isProd,
        },
        server: {
            port: 5173,
            strictPort: true,
            hmr: {
                port: 5173,
            },
        },
    });
};
