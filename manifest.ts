import { ManifestV3Export } from '@crxjs/vite-plugin';
import pkg from './package.json';

const manifest: ManifestV3Export = {
    manifest_version: 3,
    name: 'CrossSync',
    description: pkg.description,
    version: pkg.version,

    action: {
        default_popup: 'popup.html',
        default_icon: {
            16: 'logo.png',
            32: 'logo.png',
            48: 'logo.png',
            128: 'logo.png',
        },
    },
    icons: {
        16: 'logo.png',
        32: 'logo.png',
        48: 'logo.png',
        128: 'logo.png',
    },
    options_page: 'index.html',
    background: {
        service_worker: './src/service-worker.ts',
    },
    content_scripts: [
        {
            js: ['./src/content-script/index.ts'],
            matches: ['https://twitter.com/*'],
        },
    ],
};

export default manifest;
