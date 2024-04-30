import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
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
		try {
			const fileContent = await readFile(
				join(
					process.cwd(),
					`../../packages/${packageName}/docs/${packageName}/split/${version}.${normalizeItem}.api.json`,
				),
				'utf8',
			);

			return JSON.parse(fileContent);
		} catch {
			notFound();
		}
	}

	try {
		const isMainVersion = version === 'main';
		const fileContent = await fetch(
			`${process.env.BLOB_STORAGE_URL}/rewrite/${packageName}/${version}.${normalizeItem}.api.json`,
			{ next: isMainVersion ? { revalidate: 0 } : { revalidate: 604_800 } },
		);

		return await fileContent.json();
	} catch {
		notFound();
	}
}
