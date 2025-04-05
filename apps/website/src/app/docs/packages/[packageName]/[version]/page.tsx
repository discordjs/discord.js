import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

const highlighter = await createHighlighterCore({
	themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark-dimmed.mjs')],
	langs: [
		import('shiki/langs/typescript.mjs'),
		import('shiki/langs/javascript.mjs'),
		import('shiki/langs/shellscript.mjs'),
	],
	engine: createOnigurumaEngine(async () => import('shiki/wasm')),
});

export default async function Page({ params }: { readonly params: Promise<{ readonly packageName: string }> }) {
	const { packageName } = await params;

	const fileContent = await readFile(join(process.cwd(), `src/assets/readme/${packageName}/home-README.md`), 'utf8');

	return (
		<div className="prose prose-neutral dark:prose-invert prose-a:[&>img]:inline-block prose-a:[&>img]:m-0 prose-a:[&>img[height='44']]:h-11 prose-p:my-2 mx-auto max-w-screen-xl px-6 py-6 [&_div[align='center']_p_a+a]:ml-2">
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
