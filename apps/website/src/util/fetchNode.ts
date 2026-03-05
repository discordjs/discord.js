import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PACKAGES_WITH_ENTRY_POINTS } from './constants';
import { ENV } from './env';

export async function fetchNode({
	entryPoint,
	item,
	packageName,
	version,
}: {
	readonly entryPoint?: string | undefined;
	readonly item: any;
	readonly packageName: string;
	readonly version: string;
}) {
	const hasEntryPoint = PACKAGES_WITH_ENTRY_POINTS.includes(packageName);
	const normalizedEntryPoint = entryPoint ? `${entryPoint}.` : '';
	const normalizeItem = item.replaceAll(':', '.').toLowerCase();

	if (ENV.IS_LOCAL_DEV) {
		try {
			const fileContent = await readFile(
				join(
					process.cwd(),
					`${hasEntryPoint || normalizedEntryPoint ? `../../../discord-api-types` : `../../packages/${packageName}`}/docs/${packageName}/split/${version}.${normalizedEntryPoint}${normalizeItem}.api.json`,
				),
				'utf8',
			);

			return JSON.parse(fileContent);
		} catch {
			return null;
		}
	}

	const fileContent = await fetch(
		`${process.env.CF_R2_DOCS_BUCKET_URL}/${packageName}/${version}.${normalizedEntryPoint}${normalizeItem}.api.json`,
		{ cache: 'no-store' },
	);

	if (!fileContent.ok) {
		return null;
	}

	return fileContent.json();
}
