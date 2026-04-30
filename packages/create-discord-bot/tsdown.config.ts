import { createTsdownConfig } from '../../tsdown.config.js';

export default createTsdownConfig({
	entry: ['bin/index.ts'],
	dts: false,
	sourcemap: false,
});
