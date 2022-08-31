import type {
	AnyDocNodeJSON,
	DocPlainTextJSON,
	DocNodeContainerJSON,
	DocLinkTagJSON,
	DocFencedCodeJSON,
	DocBlockJSON,
	DocCommentJSON,
} from '@discordjs/api-extractor-utils';
import { Anchor, Box, Code, Text, useMantineColorScheme } from '@mantine/core';
import { DocNodeKind, StandardTags } from '@microsoft/tsdoc';
import Link from 'next/link';
import { Fragment, useCallback, type ReactNode } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, ghcolors } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { BlockComment } from './BlockComment.jsx';

export function TSDoc({ node }: { node: AnyDocNodeJSON }): JSX.Element {
	const { colorScheme } = useMantineColorScheme();

	const createNode = useCallback(
		(node: AnyDocNodeJSON, idx?: number): ReactNode => {
			let numberOfExamples = 0;
			let exampleIndex = 0;

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
					return <Fragment key={idx} />;
				case DocNodeKind.LinkTag: {
					const { codeDestination, urlDestination, text } = node as DocLinkTagJSON;

					if (codeDestination) {
						return (
							<Link key={idx} href={codeDestination.path} passHref prefetch={false}>
								<Anchor component="a" className="font-mono">
									{text ?? codeDestination.name}
								</Anchor>
							</Link>
						);
					}

					if (urlDestination) {
						return (
							<Link key={idx} href={urlDestination} passHref prefetch={false}>
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
						<Code key={idx} sx={{ display: 'inline' }} className="text-sm font-mono">
							{code}
						</Code>
					);
				}

				case DocNodeKind.FencedCode: {
					const { language, code } = node as DocFencedCodeJSON;
					return (
						<SyntaxHighlighter
							key={idx}
							wrapLines
							wrapLongLines
							language={language}
							style={colorScheme === 'dark' ? vscDarkPlus : ghcolors}
							codeTagProps={{ style: { fontFamily: 'JetBrains Mono' } }}
						>
							{code}
						</SyntaxHighlighter>
					);
				}

				case DocNodeKind.ParamBlock:
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

					return <Box key={idx}>{comment.customBlocks.map((node, idx) => createNode(node, idx))}</Box>;
				}

				default:
					console.log(`Captured unknown node kind: ${node.kind}`);
					break;
			}

			return null;
		},
		[colorScheme],
	);

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
