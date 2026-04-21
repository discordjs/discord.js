import Replace from 'unplugin-replace/rolldown';
import { createTsdownConfig } from '../../tsdown.config.js';
import packageConfig from './package.json' with { type: 'json' };

export default [
	createTsdownConfig({
		entry: ['src/index.ts'],
		plugins: [Replace({ values: { '[VI]{{inject}}[/VI]': () => packageConfig.version } })],
	}),
	createTsdownConfig({
		entry: ['src/web.ts'],
		plugins: [Replace({ values: { '[VI]{{inject}}[/VI]': () => packageConfig.version } })],
	}),
	createTsdownConfig({
		entry: ['src/strategies/*.ts'],
		outDir: 'dist/strategies',
		plugins: [Replace({ values: { '[VI]{{inject}}[/VI]': () => packageConfig.version } })],
	}),
];
