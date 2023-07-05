import { defineProject, mergeConfig } from 'vitest/config';
import configShared from '../../vitest.config.js';

export default mergeConfig(
	configShared,
	defineProject({
		test: {
			setupFiles: ['./__tests__/setup.ts'],
		},
	}),
);
