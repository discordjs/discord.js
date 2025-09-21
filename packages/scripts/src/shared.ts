import { request } from 'undici';

export const PACKAGES = [
	'discord.js',
	'brokers',
	'builders',
	'collection',
	'core',
	'formatters',
	'next',
	'proxy',
	'rest',
	'structures',
	'util',
	'voice',
	'ws',
	'discord-api-types',
];

export async function fetchVersions(pkg: string) {
	const response = await request(`https://docs.discordjs.dev/api/info?package=${pkg}`);
	return response.body.json() as Promise<string[]>;
}

export async function fetchVersionDocs(pkg: string, version: string) {
	const response = await request(`https://docs.discordjs.dev/docs/${pkg}/${version}.api.json`);
	return response.body.json();
}
