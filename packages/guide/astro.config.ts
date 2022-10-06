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
		Unocss(),
	],
	markdown: {
		remarkPlugins: [[remarkCodeHike, { autoImport: false, theme: shikiThemeDarkPlus, lineNumbers: true }]],
		rehypePlugins: [],
		extendDefaultPlugins: true,
		syntaxHighlight: false,
	},
});
