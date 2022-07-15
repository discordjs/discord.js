import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		exclude: ['**/node_modules', '**/dist', '.idea', '.git', '.cache'],
		passWithNoTests: true,
		coverage: {
			enabled: true,
			all: true,
			reporter: ['text', 'lcov', 'cobertura'],
			include: ['src'],
			exclude: [
				// All ts files that only contain types, due to ALL
				'**/*.{interface,type,d}.ts',
				// All index files that only contain exports from other files
				'**/index.ts',
			],
		},
	},
});
