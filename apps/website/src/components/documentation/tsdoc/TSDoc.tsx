import type { ApiItem } from '@discordjs/api-extractor-model';
import type { DocComment, DocFencedCode, DocLinkTag, DocNode, DocNodeContainer, DocPlainText } from '@microsoft/tsdoc';
import { DocNodeKind, StandardTags } from '@microsoft/tsdoc';
import type { Route } from 'next';
import Link from 'next/link';
import { Fragment, useCallback, type ReactNode } from 'react';
import { DocumentationLink } from '~/components/DocumentationLink';
import { BuiltinDocumentationLinks } from '~/util/builtinDocumentationLinks';
import { DISCORD_API_TYPES_DOCS_URL } from '~/util/constants';
import { ItemLink } from '../../ItemLink';
import { SyntaxHighlighter } from '../../SyntaxHighlighter';
import { resolveCanonicalReference, resolveItemURI } from '../util';
import { DefaultValueBlock, DeprecatedBlock, ExampleBlock, RemarksBlock, ReturnsBlock, SeeBlock } from './BlockComment';

export function TSDoc({ item, tsdoc }: { readonly item: ApiItem; readonly tsdoc: DocNode }): JSX.Element {
	const createNode = useCallback(
		(tsdoc: DocNode, idx?: number): ReactNode => {
			switch (tsdoc.kind) {
				case DocNodeKind.PlainText:
					return (
						<span className="break-words" key={idx}>
							{(tsdoc as DocPlainText).text}
						</span>
					);
				case DocNodeKind.Section:
				case DocNodeKind.Paragraph:
					return (
						<span className="break-words leading-relaxed" key={idx}>
							{(tsdoc as DocNodeContainer).nodes.map((node, idx) => createNode(node, idx))}
						</span>
					);
				case DocNodeKind.SoftBreak:
					return <Fragment key={idx} />;
				case DocNodeKind.LinkTag: {
					const { codeDestination, urlDestination, linkText } = tsdoc as DocLinkTag;
					if (codeDestination) {
						if (
							!codeDestination.importPath &&
							!codeDestination.packageName &&
							codeDestination.memberReferences.length === 1 &&
							codeDestination.memberReferences[0]!.memberIdentifier &&
							codeDestination.memberReferences[0]!.memberIdentifier.identifier in BuiltinDocumentationLinks
						) {
							const typeName = codeDestination.memberReferences[0]!.memberIdentifier.identifier;
							const href = BuiltinDocumentationLinks[typeName as keyof typeof BuiltinDocumentationLinks];
							return (
								<DocumentationLink key={`${typeName}-${idx}`} href={href}>
									{typeName}
								</DocumentationLink>
							);
						}

						const declarationReference = item.getAssociatedModel()?.resolveDeclarationReference(codeDestination, item);
						const foundItem = declarationReference?.resolvedApiItem;
						const resolved = resolveCanonicalReference(codeDestination, item.getAssociatedPackage());

						if (!foundItem && !resolved) return null;

						if (resolved && resolved.package === 'discord-api-types') {
							const { displayName, kind, members, containerKey } = resolved.item;
							let href = DISCORD_API_TYPES_DOCS_URL;

							// dapi-types doesn't have routes for class members
							// so we can assume this member is for an enum
							if (kind === 'enum' && members?.[0]) {
								href += `/enum/${displayName}#${members[0].displayName}`;
							} else if (kind === 'type' || kind === 'var') {
								href += `#${displayName}`;
							} else {
								href += `/${kind}/${displayName}`;
							}

							return (
								<DocumentationLink key={`${containerKey}-${idx}`} href={href}>
									{displayName}
									{members?.map((member) => `.${member.displayName}`).join('') ?? ''}
								</DocumentationLink>
							);
						}

						return (
							<ItemLink
								className="rounded font-mono text-blurple outline-none focus:ring focus:ring-width-2 focus:ring-blurple"
								itemURI={resolveItemURI(foundItem ?? resolved!.item)}
								key={idx}
								packageName={resolved?.package ?? item.getAssociatedPackage()?.displayName.replace('@discordjs/', '')}
								version={
									resolved?.package
										? // eslint-disable-next-line unicorn/better-regex
										  item.getAssociatedPackage()?.dependencies?.[resolved.package]?.replace(/[~^]/, '')
										: undefined
								}
							>
								{linkText ?? foundItem?.displayName ?? resolved!.item.displayName}
							</ItemLink>
						);
					}

					if (urlDestination) {
						return (
							<Link
								className="rounded font-mono text-blurple outline-none focus:ring focus:ring-width-2 focus:ring-blurple"
								href={urlDestination as Route}
								key={idx}
							>
								{linkText ?? urlDestination}
							</Link>
						);
					}

					return null;
				}

				case DocNodeKind.CodeSpan: {
					const { code } = tsdoc as DocFencedCode;
					return (
						<code className="text-sm font-mono" key={idx}>
							{code}
						</code>
					);
				}

				case DocNodeKind.FencedCode: {
					const { language, code } = tsdoc as DocFencedCode;
					// @ts-expect-error async component
					return <SyntaxHighlighter code={code.trim()} key={idx} lang={language ?? 'typescript'} />;
				}

				case DocNodeKind.Comment: {
					const comment = tsdoc as DocComment;

					const exampleBlocks = comment.customBlocks.filter(
						(block) => block.blockTag.tagName.toUpperCase() === StandardTags.example.tagNameWithUpperCase,
					);

					const defaultValueBlock = comment.customBlocks.find(
						(block) => block.blockTag.tagName.toUpperCase() === StandardTags.defaultValue.tagNameWithUpperCase,
					);

					return (
						<div className="flex flex-col gap-2">
							{comment.deprecatedBlock ? (
								<DeprecatedBlock>{createNode(comment.deprecatedBlock.content)}</DeprecatedBlock>
							) : null}
							{comment.summarySection ? createNode(comment.summarySection) : null}
							{comment.remarksBlock ? <RemarksBlock>{createNode(comment.remarksBlock.content)}</RemarksBlock> : null}
							{defaultValueBlock ? (
								<DefaultValueBlock>{createNode(defaultValueBlock.content)}</DefaultValueBlock>
							) : null}
							{comment.returnsBlock ? <ReturnsBlock>{createNode(comment.returnsBlock.content)}</ReturnsBlock> : null}
							{exampleBlocks.length
								? exampleBlocks.map((block, idx) => <ExampleBlock key={idx}>{createNode(block.content)}</ExampleBlock>)
								: null}
							{comment.seeBlocks.length ? (
								<SeeBlock>{comment.seeBlocks.map((seeBlock, idx) => createNode(seeBlock.content, idx))}</SeeBlock>
							) : null}
						</div>
					);
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
