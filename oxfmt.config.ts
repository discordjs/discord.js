import { defineConfig } from 'oxfmt';

export default defineConfig({
	printWidth: 120,
	useTabs: true,
	singleQuote: true,
	quoteProps: 'as-needed',
	trailingComma: 'all',
	endOfLine: 'lf',
	sortImports: true,
	sortPackageJson: true,
	ignorePatterns: [
		'CODEOWNERS',
		'pnpm-lock.yaml',
		'**/.next/**',
		'**/.source/**',
		'**/.turbo/**',
		'**/coverage/**',
		'**/dist/**',
		'**/dist-docs/**',
		'**/node_modules/**',
		'**/storybook-static/**',
		'**/CHANGELOG.md',
		'**/docs/docs.json',
		'**/docs/docs.api.json',
		'**/tsup.config.bundled*',
		'**/vite.config.ts.timestamp*',
		'**/vitest.config.ts.timestamp*',
		'apps/guide/next-env.d.ts',
		'apps/guide/src/assets/readme/**',
		'apps/guide/src/styles/unocss.css',
		'apps/website/next-env.d.ts',
		'apps/website/public/searchIndex/**',
		'apps/website/src/assets/readme/**',
		'apps/website/src/styles/unocss.css',
		'apps/website/src/util/shiki.bundle.ts',
		'packages/create-discord-bot/docs/**',
		'packages/scripts/turbo/generators/templates/**',
	],
	overrides: [
		{
			files: ['packages/discord.js/**'],
			options: {
				arrowParens: 'avoid',
				useTabs: false,
			},
		},
		{
			files: ['apps/{guide,website}/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
			options: {
				sortTailwindcss: {
					functions: ['cva', 'cx'],
				},
			},
		},
	],
});
