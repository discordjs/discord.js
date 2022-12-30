'use server';

import { genLinkToken } from '@discordjs/api-extractor-utils';
import type { ApiItem } from '@microsoft/api-extractor-model';
import type {
	DocBlock,
	DocComment,
	DocFencedCode,
	DocLinkTag,
	DocNode,
	DocNodeContainer,
	DocPlainText,
} from '@microsoft/tsdoc';
import { DocNodeKind, StandardTags } from '@microsoft/tsdoc';
import Link from 'next/link';
import { Fragment, useCallback, type ReactNode } from 'react';
import { SyntaxHighlighter } from '../../SyntaxHighlighter';
import { BlockComment } from './BlockComment';

function resolvePath(item: ApiItem, link: DocLinkTag) {
	const packageEntryPoint = link.codeDestination?.importPath
		? item.getAssociatedModel()!.getAssociatedPackage()?.findEntryPointsByPath(link.codeDestination.importPath)[0]
		: null;

	// TODO Handle version
	const codeDestination = link.codeDestination
		? genLinkToken(item.getAssociatedModel()!, link.codeDestination, packageEntryPoint ?? null, ' ')
		: null;
	const text = link.linkText ?? null;
	const urlDestination = link.urlDestination ?? null;

	return {
		text,
		codeDestination,
		urlDestination,
	};
}

export function TSDoc({ item, tsdoc }: { item: ApiItem; tsdoc: DocNode }): JSX.Element {
	const createNode = useCallback(
		(tsdoc: DocNode, idx?: number): ReactNode => {
			let numberOfExamples = 0;
			let exampleIndex = 0;

			switch (tsdoc.kind) {
				case DocNodeKind.PlainText:
					return (
						<span className="break-words" key={idx}>
							{(tsdoc as DocPlainText).text}
						</span>
					);
				case DocNodeKind.Paragraph:
					return (
						<span className="break-words leading-relaxed" key={idx}>
							{(tsdoc as DocNodeContainer).nodes.map((node, idx) => createNode(node, idx))}
						</span>
					);
				case DocNodeKind.SoftBreak:
					return <Fragment key={idx} />;
				case DocNodeKind.LinkTag: {
					const { codeDestination, urlDestination, text } = resolvePath(item, tsdoc as DocLinkTag);

					if (codeDestination) {
						return (
							<Link
								className="text-blurple focus:ring-width-2 focus:ring-blurple rounded font-mono outline-0 focus:ring"
								href={codeDestination.path}
								key={idx}
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
							>
								{text ?? urlDestination}
							</Link>
						);
					}

					return null;
				}

				case DocNodeKind.CodeSpan: {
					const { code } = tsdoc as DocFencedCode;
					return (
						<code className="font-mono text-sm" key={idx}>
							{code}
						</code>
					);
				}

				case DocNodeKind.FencedCode: {
					const { language, code } = tsdoc as DocFencedCode;
					return <SyntaxHighlighter code={code} key={idx} language={language} />;
				}

				case DocNodeKind.ParamBlock:
				case DocNodeKind.Block: {
					const { blockTag: tag } = tsdoc as DocBlock;

					if (tag.tagName.toUpperCase() === StandardTags.example.tagNameWithUpperCase) {
						exampleIndex++;
					}

					const index = numberOfExamples > 1 ? exampleIndex : undefined;

					return (
						<BlockComment index={index} key={idx} tagName={tag.tagName}>
							{createNode((tsdoc as DocBlock).content)}
						</BlockComment>
					);
				}

				case DocNodeKind.Comment: {
					const comment = tsdoc as DocComment;

					if (!comment.customBlocks.length) {
						return null;
					}

					// Cheat a bit by finding out how many comments we have beforehand...
					numberOfExamples = comment.customBlocks.filter(
						(block) => block.blockTag.tagName.toUpperCase() === StandardTags.example.tagNameWithUpperCase,
					).length;

					return <div key={idx}>{comment.customBlocks.map((node, idx) => createNode(node, idx))}</div>;
				}

				default:
					// console.log(`Captured unknown node kind: ${node.kind}`);
					return null;
			}
		},
		[item],
	);

	return (
		<>
			{tsdoc.kind === 'Paragraph' || tsdoc.kind === 'Section' ? (
				<>{(tsdoc as DocNodeContainer).nodes.map((node, idx) => createNode(node, idx))}</>
			) : (
				createNode(tsdoc)
			)}
		</>
	);
}
