import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json';

const extensionName = 'NAI utils';

export const manifest = defineManifest((env) => ({
    manifest_version: 3,
    name: env.mode === 'production' ? extensionName : `[dev] ${extensionName}`,
    description: 'Some useful utilities for NAI.',
    version: pkg.version,
    action: {
        default_popup: 'index.html',
    },
}));
