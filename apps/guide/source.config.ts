import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { transformerTwoslash } from 'fumadocs-twoslash';
import { createFileSystemTypesCache } from 'fumadocs-twoslash/cache-fs';

export const docs = defineDocs({
	dir: 'content/docs',
});

transformerTwoslash({
	typesCache: createFileSystemTypesCache(),
});

export default defineConfig({
	mdxOptions: {
		rehypeCodeOptions: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			transformers: [...(rehypeCodeDefaultOptions.transformers ?? []), transformerTwoslash()],
		},
	},
});
