import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'packages/discord.js', 'packages/voice'],
		passWithNoTests: true,
		coverage: {
			enabled: true,
			reporter: ['text', 'lcov', 'clover'],
			exclude: ['**/dist', '**/__tests__'],
		},
	},
});
