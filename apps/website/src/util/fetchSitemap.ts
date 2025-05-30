import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PACKAGES_WITH_ENTRY_POINTS } from './constants';
import { ENV } from './env';

export async function fetchSitemap({
	entryPoint,
	packageName,
	version,
}: {
	readonly entryPoint?: string | null | undefined;
	readonly packageName: string;
	readonly version: string;
}) {
	const hasEntryPoint = PACKAGES_WITH_ENTRY_POINTS.includes(packageName);
	const normalizedEntryPoint = entryPoint ? `${entryPoint}.` : '';

	if (ENV.IS_LOCAL_DEV) {
		try {
			const fileContent = await readFile(
				join(
					process.cwd(),
					`${hasEntryPoint || normalizedEntryPoint ? `../../../discord-api-types` : `../../packages/${packageName}`}/docs/${packageName}/split/${version}.${normalizedEntryPoint}sitemap.api.json`,
				),
				'utf8',
			);

			return JSON.parse(fileContent);
		} catch {
			return null;
		}
	}

	const fileContent = await fetch(
		`${process.env.CF_R2_DOCS_BUCKET_URL}/${packageName}/${version}.${normalizedEntryPoint}sitemap.api.json`,
		{ cache: 'no-store' },
	);

	if (!fileContent.ok) {
		return null;
	}

	return fileContent.json();
}
