import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ENV } from './env';

export async function fetchSitemap({
	packageName,
	version,
}: {
	readonly packageName: string;
	readonly version: string;
}) {
	if (ENV.IS_LOCAL_DEV) {
		const fileContent = await readFile(
			join(process.cwd(), `../../packages/${packageName}/docs/${packageName}/split/${version}.sitemap.api.json`),
			'utf8',
		);

		return JSON.parse(fileContent);
	}

	const isMain = version === 'main';
	const fileContent = await fetch(
		`${process.env.BLOB_STORAGE_URL}/rewrite/${packageName}/${version}.sitemap.api.json`,
		{
			next: { revalidate: isMain ? 0 : 604_800 },
		},
	);

	if (!fileContent.ok) {
		return null;
	}

	return fileContent.json();
}
