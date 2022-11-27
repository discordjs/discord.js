'use client';

import type {
	AnyDocNodeJSON,
	DocPlainTextJSON,
	DocNodeContainerJSON,
	DocLinkTagJSON,
	DocFencedCodeJSON,
	DocBlockJSON,
	DocCommentJSON,
} from '@discordjs/api-extractor-utils';
import { DocNodeKind, StandardTags } from '@microsoft/tsdoc';
import Link from 'next/link';
import { Fragment, useCallback, type ReactNode } from 'react';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import { BlockComment } from './BlockComment';

export function TSDoc({ node }: { node: AnyDocNodeJSON }): JSX.Element {
	const createNode = useCallback((node: AnyDocNodeJSON, idx?: number): ReactNode => {
		let numberOfExamples = 0;
		let exampleIndex = 0;

		switch (node.kind) {
			case DocNodeKind.PlainText:
				return (
					<span className="break-words" key={idx}>
						{(node as DocPlainTextJSON).text}
					</span>
				);
			case DocNodeKind.Paragraph:
				return (
					<span className="break-words leading-relaxed" key={idx}>
						{(node as DocNodeContainerJSON).nodes.map((node, idx) => createNode(node, idx))}
					</span>
				);
			case DocNodeKind.SoftBreak:
				return <Fragment key={idx} />;
			case DocNodeKind.LinkTag: {
				const { codeDestination, urlDestination, text } = node as DocLinkTagJSON;

				if (codeDestination) {
					return (
						<Link
							className="text-blurple focus:ring-width-2 focus:ring-blurple rounded font-mono outline-0 focus:ring"
							href={codeDestination.path}
							key={idx}
							prefetch={false}
						>
							{text ?? codeDestination.name}
						</Link>
					);
				}

				if (urlDestination) {
					return (
						<Link
							className="text-blurple focus:ring-width-2 focus:ring-blurple rounded font-mono outline-0 focus:ring"
							href={urlDestination}
							key={idx}
							prefetch={false}
						>
							{text ?? urlDestination}
						</Link>
					);
				}

				return null;
			}

			case DocNodeKind.CodeSpan: {
				const { code } = node as DocFencedCodeJSON;
				return (
					<code className="font-mono text-sm" key={idx}>
						{code}
					</code>
				);
			}

			case DocNodeKind.FencedCode: {
				const { language, code } = node as DocFencedCodeJSON;
				return <SyntaxHighlighter code={code} key={idx} language={language} />;
			}

			case DocNodeKind.ParamBlock:
			case DocNodeKind.Block: {
				const { tag } = node as DocBlockJSON;

				if (tag.tagName.toUpperCase() === StandardTags.example.tagNameWithUpperCase) {
					exampleIndex++;
				}

				const index = numberOfExamples > 1 ? exampleIndex : undefined;

				return (
					<BlockComment index={index} key={idx} tagName={tag.tagName}>
						{(node as DocBlockJSON).content.map((node, idx) => createNode(node, idx))}
					</BlockComment>
				);
			}

			case DocNodeKind.Comment: {
				const comment = node as DocCommentJSON;

				if (!comment.customBlocks.length) {
					return null;
				}

				// Cheat a bit by finding out how many comments we have beforehand...
				numberOfExamples = comment.customBlocks.filter(
					(block) => block.tag.tagName.toUpperCase() === StandardTags.example.tagNameWithUpperCase,
				).length;

				return <div key={idx}>{comment.customBlocks.map((node, idx) => createNode(node, idx))}</div>;
			}

			default:
				// console.log(`Captured unknown node kind: ${node.kind}`);
				return null;
		}
	}, []);

	return (
		<>
			{node.kind === 'Paragraph' || node.kind === 'Section' ? (
				<>{(node as DocNodeContainerJSON).nodes.map((node, idx) => createNode(node, idx))}</>
			) : (
				createNode(node)
			)}
		</>
	);
}
