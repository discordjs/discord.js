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
	const response = await request(`https://discord.js.org/api/docs/versions?packageName=${pkg}`);
	return response.body.json() as Promise<string[]>;
}

export async function fetchVersionDocs(pkg: string, version: string) {
	const response = await request(`https://r2-docs.discordjs.dev/${pkg}/${version}.json`);
	return response.body.json();
}
