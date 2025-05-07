import Link from 'next/link';
import { BuiltinDocumentationLinks } from '@/util/builtinDocumentationLinks';
import { Scrollbars } from './OverlayScrollbars';
import { SyntaxHighlighter } from './SyntaxHighlighter';

export async function DocNode({ node, version }: { readonly node?: any; readonly version: string }) {
	const createNode = (node: any, idx: number) => {
		switch (node.kind) {
			case 'PlainText':
				return <span key={`${node.text}-${idx}`}>{node.text}</span>;
			case 'LinkTag': {
				if (node.resolvedPackage) {
					return (
						<Link
							className="text-base-blurple-400 hover:text-base-blurple-500 dark:hover:text-base-blurple-300 font-mono"
							href={`/docs/packages/${node.resolvedPackage.packageName}/${node.resolvedPackage.version ?? version}/${node.uri}`}
							key={`${node.uri}-${idx}`}
							// @ts-expect-error - unstable_dynamicOnHover is not part of the public types
							unstable_dynamicOnHover
						>
							{node.text}
						</Link>
					);
				}

				if (node.uri) {
					return (
						<a
							className="text-base-blurple-400 hover:text-base-blurple-500 dark:hover:text-base-blurple-300"
							href={node.uri}
							key={`${node.text}-${idx}`}
							rel="external noreferrer noopener"
							target="_blank"
						>
							{`${node.text}${node.members ?? ''}`}
						</a>
					);
				}

				if (node.text in BuiltinDocumentationLinks) {
					const href = BuiltinDocumentationLinks[node.text as keyof typeof BuiltinDocumentationLinks];
					return (
						<a
							className="text-base-blurple-400 hover:text-base-blurple-500 dark:hover:text-base-blurple-300"
							href={href}
							key={`${node.text}-${idx}`}
							rel="external noreferrer noopener"
							target="_blank"
						>
							{node.text}
						</a>
					);
				}

				return <span key={`${node.text}-${idx}`}>{node.text}</span>;
			}

			case 'CodeSpan':
				return (
					<code className="font-mono text-sm" key={`${node.text}-${idx}`}>
						{node.text}
					</code>
				);

			case 'FencedCode': {
				const { language, text } = node;

				return (
					<Scrollbars
						className="border-base-neutral-200 dark:border-base-neutral-600 bg-base-neutral-100 dark:bg-base-neutral-900 my-4 rounded-sm border"
						defer
						key={`${language}-${text}-${idx}`}
					>
						<SyntaxHighlighter
							className="w-min bg-[#f3f3f4] py-4 text-sm dark:bg-[#121214]"
							code={text}
							lang={language}
						/>
					</Scrollbars>
				);
			}

			case 'SoftBreak':
				return null;
			default:
				return null;
		}
	};

	return node?.map(createNode) ?? null;
}
