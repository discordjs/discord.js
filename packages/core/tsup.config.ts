import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';
import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: {
		index: 'src/index.ts',
		'http-only': 'src/http-only/index.ts',
	},
	esbuildPlugins: [esbuildPluginVersionInjector()],
});
