import { defineConfig, presetTypography, presetUno, presetWebFonts } from 'unocss';

export default defineConfig({
	theme: {
		colors: {
			blurple: {
				50: '#e0e3ff',
				100: '#cdd2ff',
				200: '#9ea7ff',
				300: '#7782fa',
				DEFAULT: '#5865F2',
				500: '#3d48c3',
				600: '#293294',
				700: '#1a2165',
				800: '#0e1137',
				900: '#020208',
			},
		},
	},
	presets: [
		presetUno({ dark: 'class' }),
		presetWebFonts({
			provider: 'bunny',
			fonts: {
				mono: ['JetBrains Mono', 'JetBrains Mono:400,600,700'],
			},
		}),
		presetTypography({
			cssExtend: {
				pre: {
					padding: '1em',
					'line-height': '1.5',
					'border-radius': '4px',
				},
				code: {
					'font-size': '1em',
					'font-weight': 'unset',
				},
				':where(:not(pre) > code)::before': {
					content: '""',
				},
				':where(:not(pre) > code)::after': {
					content: '""',
				},
				a: {
					color: '#5865F2',
					'text-decoration': 'none',
				},
				'a > img': {
					display: 'inline-block',
				},
				h1: {
					'scroll-margin-top': '6.5rem',
				},
				h2: {
					'margin-top': '1.25em',
					'scroll-margin-top': '6.5rem',
				},
				h3: {
					'margin-top': '1.25em',
					'scroll-margin-top': '6.5rem',
				},
				// eslint-disable-next-line id-length
				p: {
					margin: '.5em 0',
				},
			},
		}),
	],
	include: [
		/.vue$/,
		/.vue?vue/,
		/.svelte$/,
		/.[jt]sx$/,
		/.mdx?$/,
		/.astro$/,
		/.elm$/,
		/.html$/,
		// eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
		/.*\/ui\.js(.*)?$/,
		// eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
		/.*\/ui\.mjs(.*)?$/,
	],
});
