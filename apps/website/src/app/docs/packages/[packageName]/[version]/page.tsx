import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import { getHighlighterCore } from 'shiki/core';
import getWasm from 'shiki/wasm';

const highlighter = await getHighlighterCore({
	themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark-dimmed.mjs')],
	langs: [
		import('shiki/langs/typescript.mjs'),
		import('shiki/langs/javascript.mjs'),
		import('shiki/langs/shellscript.mjs'),
	],
	loadWasm: getWasm,
});

export default async function Page({ params }: { readonly params: { readonly packageName: string } }) {
	const fileContent = await readFile(
		join(process.cwd(), `src/assets/readme/${params.packageName}/home-README.md`),
		'utf8',
	);

	return (
		<div className="prose prose-neutral mx-auto max-w-screen-xl dark:prose-invert">
			<MDXRemote
				options={{
					mdxOptions: {
						remarkPlugins: [remarkGfm],
						rehypePlugins: [
							[
								rehypeShikiFromHighlighter,
								highlighter,
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
