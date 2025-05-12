import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ENV } from './env';

export async function fetchSitemap({
	entryPoint,
	packageName,
	version,
}: {
	readonly entryPoint?: string | undefined;
	readonly packageName: string;
	readonly version: string;
}) {
	const normalizedEntryPoint = entryPoint ? `${entryPoint}.` : '';

	if (ENV.IS_LOCAL_DEV) {
		const fileContent = await readFile(
			join(
				process.cwd(),
				`../../packages/${packageName}/docs/${packageName}/split/${version}.${normalizedEntryPoint}sitemap.api.json`,
			),
			'utf8',
		);

		return JSON.parse(fileContent);
	}

	const isMain = version === 'main';
	const fileContent = await fetch(
		`${process.env.BLOB_STORAGE_URL}/rewrite/${packageName}/${version}.${normalizedEntryPoint}sitemap.api.json`,
		{
			next: { revalidate: isMain ? 0 : 604_800 },
		},
	);

	if (!fileContent.ok) {
		return null;
	}

	return fileContent.json();
}
