import presetWebFonts from '@unocss/preset-web-fonts';
import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
	presets: [
		presetUno({ dark: 'media' }),
		presetWebFonts({
			provider: 'google',
			fonts: {
				sans: 'JetBrains Mono',
			},
		}),
	],
});
