import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeIgnore from 'rehype-ignore';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { getHighlighter } from 'shiki';
import shikiLangJavascript from 'shiki/languages/javascript.tmLanguage.json';
import shikiLangTypescript from 'shiki/languages/typescript.tmLanguage.json';
import shikiThemeDarkPlus from 'shiki/themes/dark-plus.json';
import shikiThemeLightPlus from 'shiki/themes/light-plus.json';
import type { Params } from './layout';
import { MDXRemote } from '~/components/MDXRemote';

async function loadREADME(packageName: string) {
	return readFile(join(process.cwd(), 'src', 'assets', 'readme', packageName, 'home-README.md'), 'utf8');
}

async function generateMDX(readme: string) {
	return serialize(readme, {
		mdxOptions: {
			remarkPlugins: [remarkGfm],
			remarkRehypeOptions: { allowDangerousHtml: true },
			rehypePlugins: [
				rehypeRaw,
				rehypeIgnore,
				rehypeSlug,
				[
					rehypePrettyCode,
					{
						theme: {
							dark: shikiThemeDarkPlus,
							light: shikiThemeLightPlus,
						},
						getHighlighter: async (options?: Partial<Options>) =>
							getHighlighter({
								...options,
								langs: [
									// @ts-expect-error: Working as intended
									{ id: 'javascript', aliases: ['js'], scopeName: 'source.js', grammar: shikiLangJavascript },
									// @ts-expect-error: Working as intended
									{ id: 'typescript', aliases: ['ts'], scopeName: 'source.ts', grammar: shikiLangTypescript },
								],
							}),
					},
				],
			],
			format: 'md',
		},
	});
}

export default async function Page({ params }: { params: Params }) {
	const { package: packageName } = params;
	const readmeSource = await loadREADME(packageName);
	const mdxSource = await generateMDX(readmeSource);

	return (
		<main className="pt-18 lg:pl-76">
			<article className="dark:bg-dark-600 bg-white p-10">
				<div className="prose max-w-none">
					<MDXRemote {...mdxSource} />
				</div>
			</article>
		</main>
	);
}
