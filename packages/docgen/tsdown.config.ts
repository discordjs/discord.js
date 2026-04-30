import { createTsdownConfig } from '../../tsdown.config.js';

export default createTsdownConfig({
	entry: ['src/index.ts', 'bin/index.ts'],
});
