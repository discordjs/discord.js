import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
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
	const normalizedEntryPoint = entryPoint ? `${entryPoint}.` : '';
	const normalizeItem = item.replaceAll(':', '.').toLowerCase();

	if (ENV.IS_LOCAL_DEV) {
		const fileContent = await readFile(
			join(
				process.cwd(),
				`../../packages/${packageName}/docs/${packageName}/split/${version}.${normalizedEntryPoint}${normalizeItem}.api.json`,
			),
			'utf8',
		);

		return JSON.parse(fileContent);
	}

	const isMain = version === 'main';
	const fileContent = await fetch(
		`${process.env.BLOB_STORAGE_URL}/rewrite/${packageName}/${version}.${normalizedEntryPoint}${normalizeItem}.api.json`,
		{ next: { revalidate: isMain ? 0 : 604_800 } },
	);

	if (!fileContent.ok) {
		return null;
	}

	return fileContent.json();
}
