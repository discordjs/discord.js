import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { cache } from 'react';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter';

interface VersionRouteParams {
	package: string;
	version: string;
}

const loadREADME = cache(async (packageName: string) => {
	return readFile(join(process.cwd(), 'src', 'assets', 'readme', packageName, 'home-README.md'), 'utf8');
});

export default async function Page({ params }: { params: VersionRouteParams }) {
	const readmeSource = await loadREADME(params.package);
	const { content } = await compileMDX({
		source: readmeSource,
		// @ts-expect-error SyntaxHighlighter is assignable
		components: { pre: SyntaxHighlighter },
		options: {
			mdxOptions: {
				remarkPlugins: [remarkGfm],
				rehypePlugins: [rehypeSlug],
				format: 'mdx',
			},
		},
	});

	return <div className="relative top-4 max-w-none prose">{content}</div>;
}
