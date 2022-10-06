import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
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
		remarkPlugins: [],
		rehypePlugins: [],
		extendDefaultPlugins: true,
	},
});
