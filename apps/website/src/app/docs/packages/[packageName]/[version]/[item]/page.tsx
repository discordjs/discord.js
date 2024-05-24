import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocItem } from '~/components/DocItem';
import { fetchNode } from '~/util/fetchNode';

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
	const node = await fetchNode({ item: params.item, packageName: params.packageName, version: params.version });

	if (!node) {
		notFound();
	}

	return (
		<main className="flex w-full flex-col gap-8 pb-12 md:pb-0">
			<DocItem node={node} packageName={params.packageName} version={params.version} />
		</main>
	);
}
