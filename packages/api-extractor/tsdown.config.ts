import { createTsdownConfig } from '../../tsdown.config.js';

export default createTsdownConfig({
	entry: ['src/**/*.ts'],
	cjsDefault: true,
});
