import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { SerializeOptions } from 'next-mdx-remote/dist/types';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeIgnore from 'rehype-ignore';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { VersionRouteParams } from './layout';
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter';

async function loadREADME(packageName: string) {
	return readFile(join(process.cwd(), 'src', 'assets', 'readme', packageName, 'home-README.md'), 'utf8');
}

const mdxOptions = {
	mdxOptions: {
		remarkPlugins: [remarkGfm],
		remarkRehypeOptions: { allowDangerousHtml: true },
		rehypePlugins: [rehypeRaw, rehypeIgnore, rehypeSlug],
		format: 'md',
	},
} satisfies SerializeOptions;

export default async function Page({ params }: { params: VersionRouteParams }) {
	const { package: packageName } = params;
	const readmeSource = await loadREADME(packageName);

	return (
		<article className="dark:bg-dark-600 bg-white p-10">
			<div className="prose max-w-none">
				{/* @ts-expect-error async component */}
				<MDXRemote components={{ pre: SyntaxHighlighter }} options={mdxOptions} source={readmeSource} />
			</div>
		</article>
	);
}
