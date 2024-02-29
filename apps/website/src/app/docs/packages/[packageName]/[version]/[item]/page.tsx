// import { readFile } from 'node:fs/promises';
// import { join } from 'node:path';
// import { inspect } from 'node:util';
import type { Metadata } from 'next';
import { DocItem } from '~/components/DocItem';

export async function generateMetadata({
	params,
}: {
	readonly params: {
		readonly item: string;
		readonly packageName: string;
		readonly version: string;
	};
}): Promise<Metadata> {
	const normalizeItem = params.item.split(encodeURIComponent(':'))[0];

	return {
		title: `${normalizeItem} (${params.packageName} - ${params.version})`,
	};
}

export default async function Page({
	params,
}: {
	readonly params: { readonly item: string; readonly packageName: string; readonly version: string };
}) {
	const normalizeItem = params.item.split(encodeURIComponent(':')).join('.').toLowerCase();

	// const fileContent = await readFile(
	// 	join(process.cwd(), `../../packages/${params.packageName}/docs/split/${params.version}.${normalizeItem}.api.json`),
	// 	'utf8',
	// );
	// const node = JSON.parse(fileContent);

	const isMainVersion = params.version === 'main';
	const fileContent = await fetch(
		`${process.env.BLOB_STORAGE_URL}/rewrite/${params.packageName}/${params.version}.${normalizeItem}.api.json`,
		{ next: isMainVersion ? { revalidate: 0 } : { revalidate: 604_800 } },
	);
	const node = await fileContent.json();

	// console.log(inspect(node, { depth: 0 }));

	return (
		<main className="flex w-full flex-col gap-8 pb-12 md:pb-0">
			<DocItem node={node} packageName={params.packageName} version={params.version} />
		</main>
	);
}
