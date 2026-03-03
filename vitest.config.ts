import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        alias: {
            '@utils': resolve(__dirname, './server/src/utils'),
        },
    },
});
