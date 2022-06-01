import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import AutoImport from 'unplugin-auto-import/vite';
// import Components from 'unplugin-vue-components/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest';

export default defineConfig({
    build: {
        rollupOptions: {
            plugins: [
                nodePolyfills({
                    include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')],
                }),
            ],
        },
        target: 'esnext',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            stream: 'stream-browserify',
        },
    },
    plugins: [
        vue(),

        // Disabled for crx compatibility issues
        //
        // AutoImport({
        //     resolvers: [ElementPlusResolver()],
        // }),
        // Components({
        //     resolvers: [ElementPlusResolver()],
        // }),
        // nodePolyfills({
        //     include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')],
        // }),
        crx({
            manifest,
            contentScripts: {
                preambleCode: false,
            },
        }),
    ],
});
