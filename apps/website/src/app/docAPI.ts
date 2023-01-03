import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function fetchVersions(packageName: string): Promise<string[]> {
	const response = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName}`, {
		next: { revalidate: 3_600 },
	});

	return response.json();
}

export async function fetchModelJSON(packageName: string, version: string): Promise<unknown> {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
		const res = await readFile(
			join(process.cwd(), '..', '..', 'packages', packageName, 'docs', 'docs.api.json'),
			'utf8',
		);
		return JSON.parse(res);
	}

	const response = await fetch(`https://docs.discordjs.dev/docs/${packageName}/${version}.api.json`, {
		next: { revalidate: 3_600 },
	});

	return response.json();
}
