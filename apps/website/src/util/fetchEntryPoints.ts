import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PACKAGES_WITH_ENTRY_POINTS } from './constants';
import { ENV } from './env';

export async function fetchEntryPoints(packageName: string, version: string): Promise<EntryPoint[] | null> {
	const hasEntryPoint = PACKAGES_WITH_ENTRY_POINTS.includes(packageName);

	if (!hasEntryPoint) {
		return [];
	}

	if (ENV.IS_LOCAL_DEV) {
		try {
			const fileContent = await readFile(
				join(
					process.cwd(),
					`${hasEntryPoint ? `../../../discord-api-types` : `../../packages/${packageName}`}/docs/${packageName}/split/${version}.entrypoints.api.json`,
				),
				'utf8',
			);

			return JSON.parse(fileContent);
		} catch {
			return null;
		}
	}

	const fileContent = await fetch(
		`${process.env.CF_R2_DOCS_BUCKET_URL}/${packageName}/${version}.entrypoints.api.json`,
		{ cache: 'no-store' },
	);

	if (!fileContent.ok) {
		return null;
	}

	return fileContent.json();
}

export interface EntryPoint {
	readonly entryPoint: string;
}
