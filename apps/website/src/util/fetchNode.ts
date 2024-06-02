import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ENV } from './env';

export async function fetchNode({
	item,
	packageName,
	version,
}: {
	readonly item: any;
	readonly packageName: string;
	readonly version: string;
}) {
	const normalizeItem = item.split(encodeURIComponent(':')).join('.').toLowerCase();

	if (ENV.IS_LOCAL_DEV) {
		const fileContent = await readFile(
			join(
				process.cwd(),
				`../../packages/${packageName}/docs/${packageName}/split/${version}.${normalizeItem}.api.json`,
			),
			'utf8',
		);

		return JSON.parse(fileContent);
	}

	const isMainVersion = version === 'main';
	const fileContent = await fetch(
		`${process.env.BLOB_STORAGE_URL}/rewrite/${packageName}/${version}.${normalizeItem}.api.json`,
		{ next: isMainVersion ? { revalidate: 0 } : { revalidate: 604_800 } },
	);

	if (!fileContent.ok) {
		return null;
	}

	return fileContent.json();
}
