import { Anchor, Box, Code, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { DocNodeKind, StandardTags } from '@microsoft/tsdoc';
import Link from 'next/link';
import type { Language } from 'prism-react-renderer';
import type { ReactNode } from 'react';
import { BlockComment } from './BlockComment';
import type { DocBlockJSON } from '~/DocModel/comment/CommentBlock';
import type { AnyDocNodeJSON } from '~/DocModel/comment/CommentNode';
import type { DocNodeContainerJSON } from '~/DocModel/comment/CommentNodeContainer';
import type { DocFencedCodeJSON } from '~/DocModel/comment/FencedCodeCommentNode';
import type { DocLinkTagJSON } from '~/DocModel/comment/LinkTagCommentNode';
import type { DocPlainTextJSON } from '~/DocModel/comment/PlainTextCommentNode';
import type { DocCommentJSON } from '~/DocModel/comment/RootComment';

export function TSDoc({ node }: { node: AnyDocNodeJSON }): JSX.Element {
	let numberOfExamples = 0;
	let exampleIndex = 0;

	const createNode = (node: AnyDocNodeJSON, idx?: number): ReactNode => {
		switch (node.kind) {
			case DocNodeKind.PlainText:
				return (
					<Text key={idx} span style={{ wordBreak: 'break-word' }}>
						{(node as DocPlainTextJSON).text}
					</Text>
				);
			case DocNodeKind.Paragraph:
				return (
					<Text key={idx} inline style={{ wordBreak: 'break-word' }}>
						{(node as DocNodeContainerJSON).nodes.map((node, idx) => createNode(node, idx))}
					</Text>
				);
			case DocNodeKind.SoftBreak:
				return <></>;
			case DocNodeKind.LinkTag: {
				const { codeDestination, urlDestination, text } = node as DocLinkTagJSON;

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
			case DocNodeKind.CodeSpan: {
				const { code } = node as DocFencedCodeJSON;
				return (
					<Code key={idx} className="inline text-sm font-mono">
						{code}
					</Code>
				);
			}
			case DocNodeKind.FencedCode: {
				const { language, code } = node as DocFencedCodeJSON;
				return (
					<Prism key={idx} language={language as Language} withLineNumbers colorScheme="dark">
						{code}
					</Prism>
				);
			}
			case DocNodeKind.Block: {
				const { tag } = node as DocBlockJSON;

				if (tag.tagName.toUpperCase() === StandardTags.example.tagNameWithUpperCase) {
					exampleIndex++;
				}

				const index = numberOfExamples > 1 ? exampleIndex : undefined;

				return (
					<BlockComment tagName={tag.tagName} key={idx} index={index}>
						{(node as DocBlockJSON).content.map((node, idx) => createNode(node, idx))}
					</BlockComment>
				);
			}
			case DocNodeKind.Comment: {
				const comment = node as DocCommentJSON;
				// Cheat a bit by finding out how many comments we have beforehand...
				numberOfExamples = comment.customBlocks.filter(
					(block) => block.tag.tagName.toUpperCase() === StandardTags.example.tagNameWithUpperCase,
				).length;

				return <div>{comment.customBlocks.map((node, idx) => createNode(node, idx))}</div>;
			}
			default:
				break;
		}

		return null;
	};

	return (
		<Box>
			{node.kind === 'Paragraph' || node.kind === 'Section' ? (
				<>{(node as DocNodeContainerJSON).nodes.map((node, idx) => createNode(node, idx))}</>
			) : (
				createNode(node)
			)}
		</Box>
	);
}
