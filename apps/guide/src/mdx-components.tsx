import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		Popup,
		PopupContent,
		PopupTrigger,
		...components,
	};
}
