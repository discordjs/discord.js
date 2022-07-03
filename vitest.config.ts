import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		exclude: ['**/node_modules', '**/dist', '.idea', '.git', '.cache'],
		passWithNoTests: true,
		coverage: {
			enabled: true,
			all: true,
			reporter: ['text', 'lcov', 'clover'],
			include: ['src'],
			// All ts files that only contain types, due to ALL
			exclude: ['**/*.{interface,type,d}.ts'],
		},
	},
});
