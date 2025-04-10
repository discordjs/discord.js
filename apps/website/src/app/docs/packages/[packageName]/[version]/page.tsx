'use cache';

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import { getSingletonHighlighter } from '@/util/shiki.bundle';

export default async function Page({ params }: { readonly params: Promise<{ readonly packageName: string }> }) {
	const { packageName } = await params;

	const fileContent = await readFile(join(process.cwd(), `src/assets/readme/${packageName}/home-README.md`), 'utf8');

	return (
		<div className="prose prose-neutral dark:prose-invert prose-a:[&>img]:inline-block prose-a:[&>img]:m-0 prose-a:[&>img[height='44']]:h-11 prose-p:my-2 prose-pre:py-3 prose-pre:rounded-sm prose-pre:px-0 prose-pre:border prose-pre:border-[#d4d4d4] dark:prose-pre:border-[#404040] prose-code:font-normal prose-a:text-[#5865F2] prose-a:no-underline prose-a:hover:text-[#3d48c3] dark:prose-a:hover:text-[#7782fa] mx-auto max-w-screen-xl px-6 py-6 [&_code_span:last-of-type:empty]:hidden [&_div[align='center']_p_a+a]:ml-2">
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
