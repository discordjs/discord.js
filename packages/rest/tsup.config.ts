import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';
import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['src/node.ts', 'src/web.ts'],
	esbuildPlugins: [esbuildPluginVersionInjector()],
});
