import Link from 'next/link';
import { BuiltinDocumentationLinks } from '~/util/builtinDocumentationLinks';
import { OverlayScrollbarsComponent } from './OverlayScrollbars';
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
							key={`${node.text}-${idx}`}
							className="font-mono text-blurple hover:text-blurple-500 dark:hover:text-blurple-300"
							href={`/docs/packages/${node.resolvedPackage.packageName}/${node.resolvedPackage.version ?? version}/${node.uri}`}
						>
							{node.text}
						</Link>
					);
				}

				if (node.uri) {
					return (
						<a
							key={`${node.text}-${idx}`}
							className="text-blurple hover:text-blurple-500 dark:hover:text-blurple-300"
							href={node.uri}
							rel="external noreferrer noopener"
							target="_blank"
						>
							{`${node.text}${node.members}`}
						</a>
					);
				}

				if (node.text in BuiltinDocumentationLinks) {
					const href = BuiltinDocumentationLinks[node.text as keyof typeof BuiltinDocumentationLinks];
					return (
						<a
							key={`${node.text}-${idx}`}
							className="text-blurple hover:text-blurple-500 dark:hover:text-blurple-300"
							href={href}
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
					<code key={`${node.text}-${idx}`} className="font-mono text-sm">
						{node.text}
					</code>
				);

			case 'FencedCode': {
				const { language, text } = node;

				return (
					<OverlayScrollbarsComponent
						defer
						options={{
							overflow: { y: 'hidden' },
							scrollbars: { autoHide: 'scroll', autoHideDelay: 500, autoHideSuspend: true, clickScroll: true },
						}}
						className="my-4 rounded-md border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
					>
						<SyntaxHighlighter className="py-4 text-sm " lang={language} code={text} />
					</OverlayScrollbarsComponent>
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
