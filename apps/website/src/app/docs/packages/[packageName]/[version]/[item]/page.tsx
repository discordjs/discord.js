'use cache';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocItem } from '@/components/DocItem';
import { fetchNode } from '@/util/fetchNode';

export async function generateMetadata({
	params,
}: {
	readonly params: Promise<{
		readonly item: string;
		readonly packageName: string;
		readonly version: string;
	}>;
}): Promise<Metadata> {
	const { item, packageName, version } = await params;

	const normalizeItem = item.split(encodeURIComponent(':'))[0];

	return {
		title: `${normalizeItem} (${packageName} - ${version})`,
	};
}

export default async function Page({
	params,
}: {
	readonly params: Promise<{ readonly item: string; readonly packageName: string; readonly version: string }>;
}) {
	const { item, packageName, version } = await params;

	const node = await fetchNode({ item, packageName, version });

	if (!node) {
		notFound();
	}

	return (
		<main className="mx-auto flex w-full max-w-screen-xl flex-col gap-8 px-6 py-4">
			<DocItem node={node} packageName={packageName} version={version} />
		</main>
	);
}
