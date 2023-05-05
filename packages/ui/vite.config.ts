import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import Unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [dts(), react(), Unocss({ include: ['.storybook/preview.ts'], configFile: '../../unocss.config.ts' })],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/lib/index.ts'),
			formats: ['es'],
			name: 'ui',
			fileName: 'ui',
		},
		rollupOptions: {
			external: [
				'react',
				'react-dom',
				'ariakit/disclosure',
				'@react-icons/all-files/vsc/VscFlame',
				'@react-icons/all-files/vsc/VscInfo',
				'@react-icons/all-files/vsc/VscWarning',
				'@react-icons/all-files/vsc/VscChevronDown',
				'@react-icons/all-files/fi/FiCheck',
			],
		},
	},
});
