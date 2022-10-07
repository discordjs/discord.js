import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import Unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [react(), dts(), Unocss()],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/lib/index.ts'),
			formats: ['es'],
			name: 'ui',
			fileName: 'ui',
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'ariakit/disclosure', 'react-icons/vsc'],
		},
	},
});
