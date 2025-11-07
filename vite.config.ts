import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
    plugins: [sveltekit(), wasm(), devtoolsJson()],
    server: {
        allowedHosts: ['tunnel.thatother.dev'],
    },
});
