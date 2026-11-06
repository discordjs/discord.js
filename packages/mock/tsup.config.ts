import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';
import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: {
		index: 'src/index.ts',
		world: 'src/world/index.ts',
		gateway: 'src/gateway/index.ts',
	},
	esbuildPlugins: [esbuildPluginVersionInjector()],
});
