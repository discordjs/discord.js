import { fileURLToPath, URL } from 'node:url';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { remarkCodeHike } from '@code-hike/mdx';
import { defineConfig } from 'astro/config';
import shikiThemeDarkPlus from 'shiki/themes/dark-plus.json' assert { type: 'json' };
import Unocss from 'unocss/astro';

export default defineConfig({
	integrations: [
		react(),
		mdx(),
		image({
			serviceEntryPoint: '@astrojs/image/sharp',
		}),
		Unocss({
			configFile: fileURLToPath(new URL('../ui/unocss.config.ts', import.meta.url)),
		}),
	],
	markdown: {
		remarkPlugins: [[remarkCodeHike, { autoImport: false, theme: shikiThemeDarkPlus, lineNumbers: true }]],
		rehypePlugins: [],
		extendDefaultPlugins: true,
		syntaxHighlight: false,
	},
	vite: {
		resolve: {
			alias: {
				'ariakit/button': fileURLToPath(new URL('node_modules/ariakit/esm/button/index.js', import.meta.url)),
				'ariakit/disclosure': fileURLToPath(new URL('node_modules/ariakit/esm/disclosure/index.js', import.meta.url)),
				'ariakit-utils/dom': fileURLToPath(new URL('node_modules/ariakit-utils/esm/dom.js', import.meta.url)),
				'ariakit-utils/events': fileURLToPath(new URL('node_modules/ariakit-utils/esm/events.js', import.meta.url)),
				'ariakit-utils/focus': fileURLToPath(new URL('node_modules/ariakit-utils/esm/focus.js', import.meta.url)),
				'ariakit-utils/hooks': fileURLToPath(new URL('node_modules/ariakit-utils/esm/hooks.js', import.meta.url)),
				'ariakit-utils/misc': fileURLToPath(new URL('node_modules/ariakit-utils/esm/misc.js', import.meta.url)),
				'ariakit-utils/platform': fileURLToPath(new URL('node_modules/ariakit-utils/esm/platform.js', import.meta.url)),
				'ariakit-utils/system': fileURLToPath(new URL('node_modules/ariakit-utils/esm/system.js', import.meta.url)),
				'react-icons/fi': fileURLToPath(new URL('node_modules/react-icons/fi/index.esm.js', import.meta.url)),
				'react-icons/vsc': fileURLToPath(new URL('node_modules/react-icons/vsc/index.esm.js', import.meta.url)),
				'react-use': fileURLToPath(new URL('node_modules/react-use/esm/index.js', import.meta.url)),
			},
		},
	},
});
