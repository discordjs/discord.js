import { Routes } from 'discord-api-types/v10';
import { glob, readFile } from 'node:fs/promises';

const usedRoutes = new Set();

const ignoredRoutes = new Set([
	// Deprecated
	'channelPins',
	'channelPin',
	'guilds',
	'guildCurrentMemberNickname',
	'guildMFA',
	'nitroStickerPacks',
]);

for await (const file of glob('src/api/*.ts')) {
	const content = await readFile(file, 'utf-8');

	const routes = content.matchAll(/Routes\.([\w\d_]+)/g);
	for (const route of routes) {
		usedRoutes.add(route[1]);
	}
}

const unusedRoutes = Object.keys(Routes).filter((route) => !usedRoutes.has(route) && !ignoredRoutes.has(route));

if (unusedRoutes.length > 0) {
	console.warn('The following routes are not implemented:');
	for (const route of unusedRoutes) {
		console.warn(` - ${route}`);
	}
} else {
	console.log('No missing routes.');
}
