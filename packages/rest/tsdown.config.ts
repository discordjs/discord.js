import Replace from 'unplugin-replace/rolldown';
import { createTsdownConfig, versionInjectOptions } from '../../tsdown.config.js';
import packageConfig from './package.json' with { type: 'json' };

export default [
	createTsdownConfig({
		entry: ['src/index.ts'],
		plugins: [Replace(versionInjectOptions(packageConfig.version))],
	}),
	createTsdownConfig({
		entry: ['src/web.ts'],
		plugins: [Replace(versionInjectOptions(packageConfig.version))],
	}),
	createTsdownConfig({
		entry: ['src/strategies/*.ts'],
		outDir: 'dist/strategies',
		plugins: [Replace(versionInjectOptions(packageConfig.version))],
	}),
];
