import { remarkCodeHike } from '@code-hike/mdx';
import { defineDocumentType, makeSource } from 'contentlayer/source-files';
// import { type Node, toString } from 'hast-util-to-string';
// import { h } from 'hastscript';
// import { escape } from 'html-escaper';
// import rehypeAutolinkHeadings from 'rehype-autolink-headings';
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
	},
}));

// const LinkIcon = h(
// 	'svg',
// 	{
// 		width: '1rem',
// 		height: '1rem',
// 		viewBox: '0 0 24 24',
// 		fill: 'none',
// 		stroke: 'currentColor',
// 		strokeWidth: '2',
// 		strokeLinecap: 'round',
// 		strokeLinejoin: 'round',
// 	},
// 	h('path', {
// 		// eslint-disable-next-line id-length
// 		d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
// 	}),
// 	h('path', {
// 		// eslint-disable-next-line id-length
// 		d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
// 	}),
// );

// const createSROnlyLabel = (text: any) => {
// 	const node = h('span.sr-only', `Section titled ${escape(text)}`);
// 	node.properties!['is:raw'] = true;
// 	return node;
// };

export default makeSource({
	contentDirPath: 'src/content',
	documentTypes: [Content],
	mdx: {
		remarkPlugins: [remarkGfm, [remarkCodeHike, { theme: codeHikeThemeDarkPlus, lineNumbers: true }]],
		rehypePlugins: [
			rehypeSlug,
			// [
			// 	rehypeAutolinkHeadings,
			// 	{
			// 		properties: {
			// 			class:
			// 				'relative inline-flex w-6 h-6 place-items-center place-content-center outline-0 text-black dark:text-white ml-2',
			// 		},
			// 		behavior: 'after',
			// 		group: async ({ tagName }: { tagName: string }) =>
			// 			h('div', {
			// 				class: `[&>*]:inline-block [&>h1]:m-0 [&>h2]:m-0 [&>h3]:m-0 [&>h4]:m-0 level-${tagName}`,
			// 				tabIndex: -1,
			// 			}),
			// 		content: (heading: Node) => [
			// 			h(
			// 				`span.anchor-icon`,
			// 				{
			// 					ariaHidden: 'true',
			// 				},
			// 				LinkIcon,
			// 			),
			// 			createSROnlyLabel(toString(heading)),
			// 		],
			// 	},
			// ],
		],
	},
});
