import Replace from 'unplugin-replace/rolldown';
import { createTsdownConfig, versionInjectOptions } from '../../tsdown.config.js';
import packageConfig from './package.json' with { type: 'json' };

export default [
	createTsdownConfig({
		plugins: [Replace(versionInjectOptions(packageConfig.version))],
	}),
	createTsdownConfig({
		entry: {
			'http-only': 'src/http-only/index.ts',
		},
		plugins: [Replace(versionInjectOptions(packageConfig.version))],
	}),
];
