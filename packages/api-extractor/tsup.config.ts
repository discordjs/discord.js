import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['src/**/*.ts'],
	minify: 'terser',
	cjsInterop: true,
	noExternal: ['@microsoft/tsdoc*'],
});
