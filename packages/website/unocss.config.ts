import presetWebFonts from '@unocss/preset-web-fonts';
import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
	theme: {
		colors: {
			blurple: '#5865F2',
		},
	},
	presets: [
		presetUno({
			dark: 'media',
		}),
		presetWebFonts({
			provider: 'google',
			fonts: {
				sans: 'JetBrains Mono',
			},
		}),
	],
});
