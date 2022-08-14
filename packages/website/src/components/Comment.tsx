import { Anchor, Box, Text } from '@mantine/core';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { CommentNode } from '~/DocModel/comment/CommentNode';
import type { CommentNodeContainer } from '~/DocModel/comment/CommentNodeContainer';
import type { FencedCodeCommentNode } from '~/DocModel/comment/FencedCodeCommentNode';
import type { LinkTagCommentNode } from '~/DocModel/comment/LinkTagCommentNode';
import type { PlainTextCommentNode } from '~/DocModel/comment/PlainTextCommentNode';

export function CommentSection({ node }: { node: ReturnType<CommentNode['toJSON']> }): JSX.Element {
	const createNode = (node: ReturnType<CommentNode['toJSON']>, idx?: number): ReactNode => {
		switch (node.kind) {
			case 'PlainText':
				return (
					<Text key={idx} span>
						{(node as ReturnType<PlainTextCommentNode['toJSON']>).text}
					</Text>
				);
			case 'Paragraph':
				return (
					<Text key={idx} inline>
						{(node as ReturnType<CommentNodeContainer['toJSON']>).nodes.map((node, idx) => createNode(node, idx))}
					</Text>
				);
			case 'SoftBreak':
				return <br key={idx} />;
			case 'LinkTag': {
				const { codeDestination, urlDestination, text } = node as ReturnType<LinkTagCommentNode['toJSON']>;

				if (codeDestination) {
					return (
						<Link key={idx} href={codeDestination.path} passHref>
							<Anchor component="a" className="font-mono">
								{text ?? codeDestination.name}
							</Anchor>
						</Link>
					);
				}

				if (urlDestination) {
					return (
						<Link key={idx} href={urlDestination} passHref>
							<Anchor component="a" className="font-mono">
								{text ?? urlDestination}
							</Anchor>
						</Link>
					);
				}

				return null;
			}
			case 'FencedCodeBlock': {
				const { language, code } = node as ReturnType<FencedCodeCommentNode['toJSON']>;
				return (
					<SyntaxHighlighter
						key={idx}
						wrapLines
						wrapLongLines
						language={language}
						style={vscDarkPlus}
						codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
					>
						{code}
					</SyntaxHighlighter>
				);
			}
			default:
				break;
		}

		return null;
	};

	return (
		<Box>
			{node.kind === 'Paragraph' || node.kind === 'Section' ? (
				<>{(node as CommentNodeContainer).nodes.map((node, idx) => createNode(node, idx))}</>
			) : (
				createNode(node)
			)}
		</Box>
	);
}
