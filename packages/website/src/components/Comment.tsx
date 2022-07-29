import Link from 'next/link';
import type { ReactNode } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import type { CommentNode } from '~/DocModel/comment/CommentNode';
import type { CommentNodeContainer } from '~/DocModel/comment/CommentNodeContainer';
import type { FencedCodeCommentNode } from '~/DocModel/comment/FencedCodeCommentNode';
import type { LinkTagCommentNode } from '~/DocModel/comment/LinkTagCommentNode';
import type { PlainTextCommentNode } from '~/DocModel/comment/PlainTextCommentNode';

export interface RemarksBlockProps {
	node: ReturnType<CommentNode['toJSON']>;
	textClassName?: string | undefined;
}

export function CommentSection({ node, textClassName }: RemarksBlockProps): JSX.Element {
	const createNode = (node: ReturnType<CommentNode['toJSON']>): ReactNode => {
		switch (node.kind) {
			case 'PlainText':
				return <span>{(node as ReturnType<PlainTextCommentNode['toJSON']>).text}</span>;
			case 'Paragraph':
				return (
					<p className={textClassName}>
						{(node as ReturnType<CommentNodeContainer['toJSON']>).nodes.map((node) => createNode(node))}
					</p>
				);
			case 'SoftBreak':
				return <br />;
			case 'LinkTag': {
				const { codeDestination, urlDestination, text } = node as ReturnType<LinkTagCommentNode['toJSON']>;

				if (codeDestination) {
					return <Link href={codeDestination.path}>{text ?? codeDestination.name}</Link>;
				}

				if (urlDestination) {
					return <Link href={urlDestination}>{text ?? urlDestination}</Link>;
				}

				return null;
			}
			case 'FencedCodeBlock': {
				const { language, code } = node as ReturnType<FencedCodeCommentNode['toJSON']>;
				return <SyntaxHighlighter language={language}>{code}</SyntaxHighlighter>;
			}
			default:
				break;
		}

		return null;
	};

	return (
		<div>
			{node.kind === 'Paragraph' || node.kind === 'Section' ? (
				<>{(node as CommentNodeContainer).nodes.map(createNode)}</>
			) : (
				<>{createNode(node)}</>
			)}
		</div>
	);
}
