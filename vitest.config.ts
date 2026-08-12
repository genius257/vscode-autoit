import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        alias: {
            '@utils': resolve(__dirname, './server/src/utils'),
            'locutus/php/strings': resolve(__dirname, 'node_modules/locutus/php/strings/index.js'),
            'locutus/php/array': resolve(__dirname, 'node_modules/locutus/php/array/index.js'),
        },
    },
});
