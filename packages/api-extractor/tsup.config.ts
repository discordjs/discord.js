import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['src/**/*.ts'],
	cjsInterop: true,
	noExternal: ['@microsoft/tsdoc*'],
});
