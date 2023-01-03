import type { ApiItem } from '@microsoft/api-extractor-model';

export async function fetchVersions(packageName: string): Promise<string[]> {
	const response = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName}`, {
		next: { revalidate: 3_600 },
	});

	return response.json();
}

export async function fetchModelJSON(packageName: string, version: string): Promise<ApiItem[]> {
	const response = await fetch(`https://docs.discordjs.dev/docs/${packageName}/${version}.api.json`, {
		next: { revalidate: 3_600 },
	});

	return response.json();
}
