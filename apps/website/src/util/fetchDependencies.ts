import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ENV } from './env';

export async function fetchDependencies({
	packageName,
	version,
}: {
	readonly packageName: string;
	readonly version: string;
}) {
	if (ENV.IS_LOCAL_DEV) {
		try {
			const fileContent = await readFile(
				join(process.cwd(), `../../packages/${packageName}/docs/${packageName}/split/${version}.dependencies.api.json`),
				'utf8',
			);

			const parsedDependencies = JSON.parse(fileContent);

			return Object.entries<string>(parsedDependencies)
				.filter(([key]) => key.startsWith('@discordjs/') && !key.includes('api-extractor'))
				.map(([key, value]) => `${key.replace('@discordjs/', '').replaceAll('.', '-')}-${value.replaceAll('.', '-')}`);
		} catch {
			return [];
		}
	}

	try {
		const isMainVersion = version === 'main';
		const fileContent = await fetch(
			`${process.env.BLOB_STORAGE_URL}/rewrite/${packageName}/${version}.dependencies.api.json`,
			{ next: isMainVersion ? { revalidate: 0 } : { revalidate: 604_800 } },
		);
		const parsedDependencies = await fileContent.json();

		return Object.entries<string>(parsedDependencies)
			.filter(([key]) => key.startsWith('@discordjs/') && !key.includes('api-extractor'))
			.map(([key, value]) => `${key.replace('@discordjs/', '').replaceAll('.', '-')}-${value.replaceAll('.', '-')}`);
	} catch {
		return [];
	}
}
