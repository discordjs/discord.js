import Replace from 'unplugin-replace/rolldown';
import { createTsdownConfig, versionInjectOptions } from '../../tsdown.config.js';
import packageConfig from './package.json' with { type: 'json' };

export default [
	createTsdownConfig({
		plugins: [Replace(versionInjectOptions(packageConfig.version))],
	}),
	createTsdownConfig({
		entry: {
			defaultWorker: 'src/strategies/sharding/defaultWorker.ts',
		},
	}),
];
