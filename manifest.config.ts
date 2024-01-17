import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json';

const extensionName = 'NAI utils';

export const manifest = defineManifest((env) => ({
    manifest_version: 3,
    name: env.mode === 'production' ? extensionName : `[dev] ${extensionName}`,
    description: 'Some useful utilities for NAI.',
    version: pkg.version,
    icons: {
        '128': 'icon.png',
    },
    action: {
        default_popup: 'index.html',
        default_icon: {
            '128': 'icon.png',
        },
    },
    content_scripts: [
        {
            matches: ['https://novelai.net/image'],
            js: ['./src/content'],
        },
    ],
}));
