import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	entry: ['src/create-discord-bot.ts'],
	dts: false,
	format: 'esm',
	minify: true,
	sourcemap: false,
});
