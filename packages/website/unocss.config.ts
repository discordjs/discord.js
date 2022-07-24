import presetWebFonts from '@unocss/preset-web-fonts';
import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
	theme: {
		colors: {
			blurple: '#5865F2',
		},
	},
	presets: [
		presetUno({ dark: 'class' }),
		presetWebFonts({
			provider: 'google',
			fonts: {
				mono: ['JetBrains Mono', 'JetBrains Mono:400,600'],
			},
		}),
	],
});
