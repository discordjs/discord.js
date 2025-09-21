import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import { DocItem } from '@/components/DocItem';
import { PACKAGES_WITH_ENTRY_POINTS } from '@/util/constants';
import { fetchNode } from '@/util/fetchNode';
import { parseDocsPathParams } from '@/util/parseDocsPathParams';
import { getSingletonHighlighter } from '@/util/shiki.bundle';

export async function generateMetadata({
	params,
}: {
	readonly params: Promise<{
		readonly item?: string[] | undefined;
		readonly packageName: string;
		readonly version: string;
	}>;
}): Promise<Metadata> {
	const { item, packageName, version } = await params;

	const { foundItem } = parseDocsPathParams(item);

	if (!foundItem) {
		return {
			title: `${packageName} (${version})`,
		};
	}

	const decodedItemName = decodeURIComponent(foundItem);
	const titlePart = decodedItemName.split(':')?.[0] ?? decodedItemName;

	return {
		title: `${titlePart} (${packageName} - ${version})`,
	};
}

export default async function Page({
	params,
}: {
	readonly params: Promise<{
		readonly item?: string[] | undefined;
		readonly packageName: string;
		readonly version: string;
	}>;
}) {
	const { item, packageName, version } = await params;

	const { entryPoints: parsedEntrypoints, foundItem } = parseDocsPathParams(item);

	if (!foundItem) {
		const hasEntryPoint = PACKAGES_WITH_ENTRY_POINTS.includes(packageName);

		if (hasEntryPoint) {
			return <>Placeholder</>;
		}

		const fileContent = await readFile(join(process.cwd(), `src/assets/readme/${packageName}/home-README.md`), 'utf8');

		return (
			<div className="prose prose-neutral dark:prose-invert prose-a:[&>img]:inline-block prose-a:[&>img]:m-0 prose-a:[&>img[height='44']]:h-11 prose-p:my-2 prose-pre:py-3 prose-pre:rounded-sm prose-pre:px-0 prose-pre:border prose-pre:border-[#d4d4d4] dark:prose-pre:border-[#404040] prose-code:font-normal prose-a:text-[#5865F2] prose-a:no-underline prose-a:hover:text-[#3d48c3] dark:prose-a:hover:text-[#7782fa] mx-auto max-w-screen-xl px-6 py-6 break-words [&_code_span:last-of-type:empty]:hidden [&_div[align='center']_p_a+a]:ml-2">
				<MDXRemote
					options={{
						mdxOptions: {
							remarkPlugins: [remarkGfm],
							rehypePlugins: [
								[
									rehypeShikiFromHighlighter,
									await getSingletonHighlighter({
										langs: ['typescript', 'javascript', 'shellscript'],
										themes: ['github-light', 'github-dark-dimmed'],
									}),
									{
										themes: {
											light: 'github-light',
											dark: 'github-dark-dimmed',
										},
									},
								],
							],
						},
					}}
					source={fileContent}
				/>
			</div>
		);
	}

	const entryPointString = parsedEntrypoints.join('.');

	const node = await fetchNode({
		entryPoint: entryPointString,
		item: decodeURIComponent(foundItem),
		packageName,
		version,
	});

	if (!node) {
		notFound();
	}

	return (
		<main className="mx-auto flex w-full max-w-screen-xl flex-col gap-8 px-6 py-4">
			<DocItem node={node} packageName={packageName} version={version} />
		</main>
	);
}
