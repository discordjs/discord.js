import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';
import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['src/index.ts', 'src/strategies/undiciRequest.ts'],
	esbuildPlugins: [esbuildPluginVersionInjector()],
});
