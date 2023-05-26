import { remarkCodeHike } from '@code-hike/mdx';
import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import GithubSlugger from 'github-slugger';
import { type Node, toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import { escape } from 'html-escaper';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import codeHikeThemeDarkPlus from './src/styles/code-hike-theme-dark-plus.json';

export const Content = defineDocumentType(() => ({
	name: 'Content',
	filePathPattern: `**/*.mdx`,
	contentType: 'mdx',
	fields: {
		title: {
			type: 'string',
			required: true,
		},
		category: {
			type: 'string',
			required: true,
		},
	},
	computedFields: {
		slug: {
			type: 'string',
			// eslint-disable-next-line unicorn/prefer-string-replace-all
			resolve: (doc) => doc._raw.flattenedPath.replace(/\d+-/g, ''),
		},
		url: {
			type: 'string',
			// eslint-disable-next-line unicorn/prefer-string-replace-all
			resolve: (doc) => `/guide/${doc._raw.flattenedPath.replace(/\d+-/g, '')}`,
		},
		headings: {
			type: 'json',
			resolve: async (doc) => {
				const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
				const slugger = new GithubSlugger();
				// @ts-expect-error TypeScript can't infer
				return Array.from(doc.body.raw.matchAll(regXHeader)).map(({ groups }) => {
					const flag = groups?.flag;
					const content = groups?.content;
					return {
						level: flag?.length,
						text: content,
						slug: content ? slugger.slug(content) : undefined,
					};
				});
			},
		},
	},
}));

const LinkIcon = h(
	'svg',
	{
		width: '1.25rem',
		height: '1.25rem',
		viewBox: '0 0 24 24',
		fill: 'none',
		stroke: 'currentColor',
		strokeWidth: '2',
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
	},
	h('path', {
		// eslint-disable-next-line id-length
		d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
	}),
	h('path', {
		// eslint-disable-next-line id-length
		d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
	}),
);

const createSROnlyLabel = (text: any) => {
	return h('span', { class: 'sr-only' }, `Section titled ${escape(text)}`);
};

export default makeSource({
	contentDirPath: 'src/content',
	documentTypes: [Content],
	mdx: {
		remarkPlugins: [remarkGfm, [remarkCodeHike, { theme: codeHikeThemeDarkPlus, lineNumbers: true }]],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						class:
							'relative inline-flex place-items-center place-content-center outline-none text-black dark:text-white pr-2 -ml-8 opacity-0 group-hover:opacity-100',
					},
					behavior: 'prepend',
					content: (heading: Node) => [
						h(
							`span.anchor-icon`,
							{
								ariaHidden: 'true',
							},
							LinkIcon,
						),
						createSROnlyLabel(toString(heading)),
					],
				},
			],
		],
	},
});
