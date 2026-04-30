import Replace from 'unplugin-replace/rolldown';
import { createTsdownConfig, versionInjectOptions } from '../../tsdown.config.js';
import packageConfig from './package.json' with { type: 'json' };

export default createTsdownConfig({
	entry: ['src/index.ts', 'src/exports/*.ts'],
	plugins: [Replace(versionInjectOptions(packageConfig.version))],
});
