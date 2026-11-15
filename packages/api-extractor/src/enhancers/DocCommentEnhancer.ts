// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { ReleaseTag } from '@discordjs/api-extractor-model';
import * as tsdoc from '@microsoft/tsdoc';
import * as ts from 'typescript/ast';
import type { AstDeclaration } from '../analyzer/AstDeclaration.js';
import { ResolverFailure } from '../analyzer/AstReferenceResolver.js';
import { AstSymbol } from '../analyzer/AstSymbol.js';
import { ExtractorMessageId } from '../api/ExtractorMessageId.js';
import type { ApiItemMetadata } from '../collector/ApiItemMetadata.js';
import type { Collector } from '../collector/Collector.js';
import { VisitorState } from '../collector/VisitorState.js';
import type { IWorkingPackageEntryPoint } from '../collector/WorkingPackage.js';

export class DocCommentEnhancer {
	readonly #collector: Collector;

	public constructor(collector: Collector) {
		this.#collector = collector;
	}

	public static analyze(collector: Collector): void {
		const docCommentEnhancer: DocCommentEnhancer = new DocCommentEnhancer(collector);
		docCommentEnhancer.analyze();
	}

	public analyze(): void {
		for (const [entryPoint, entities] of this.#collector.entities) {
			for (const entity of entities) {
				if (
					entity.astEntity instanceof AstSymbol &&
					(entity.consumable ||
						this.#collector.extractorConfig.apiReportIncludeForgottenExports ||
						this.#collector.extractorConfig.docModelIncludeForgottenExports)
				) {
					entity.astEntity.forEachDeclarationRecursive((astDeclaration: AstDeclaration) => {
						this.#analyzeApiItem(astDeclaration, entryPoint);
					});
				}
			}
		}
	}

	#analyzeApiItem(astDeclaration: AstDeclaration, entryPoint: IWorkingPackageEntryPoint): void {
		const metadata: ApiItemMetadata = this.#collector.fetchApiItemMetadata(astDeclaration);
		if (metadata.docCommentEnhancerVisitorState === VisitorState.Visited) {
			return;
		}

		if (metadata.docCommentEnhancerVisitorState === VisitorState.Visiting) {
			this.#collector.messageRouter.addAnalyzerIssue(
				ExtractorMessageId.CyclicInheritDoc,
				`The @inheritDoc tag for "${astDeclaration.astSymbol.localName}" refers to its own declaration`,
				astDeclaration,
			);
			return;
		}

		metadata.docCommentEnhancerVisitorState = VisitorState.Visiting;

		if (metadata.tsdocComment?.inheritDocTag) {
			this.#applyInheritDoc(astDeclaration, metadata.tsdocComment, metadata.tsdocComment.inheritDocTag, entryPoint);
			metadata.artificialDocComment = true;
		}

		this.#analyzeNeedsDocumentation(astDeclaration, metadata);

		this.#checkForBrokenLinks(astDeclaration, metadata, entryPoint);

		metadata.docCommentEnhancerVisitorState = VisitorState.Visited;
	}

	#analyzeNeedsDocumentation(astDeclaration: AstDeclaration, metadata: ApiItemMetadata): void {
		if (astDeclaration.declaration.kind === ts.SyntaxKind.Constructor) {
			// Constructors always do pretty much the same thing, so it's annoying to require people to write
			// descriptions for them.  Instead, if the constructor lacks a TSDoc summary, then API Extractor
			// will auto-generate one.
			metadata.undocumented = false;

			// The class that contains this constructor
			const classDeclaration: AstDeclaration = astDeclaration.parent!;

			const configuration: tsdoc.TSDocConfiguration = this.#collector.extractorConfig.tsdocConfiguration;

			if (!metadata.tsdocComment) {
				metadata.tsdocComment = new tsdoc.DocComment({ configuration });
			}

			if (!tsdoc.PlainTextEmitter.hasAnyTextContent(metadata.tsdocComment.summarySection)) {
				metadata.tsdocComment.summarySection.appendNodesInParagraph([
					new tsdoc.DocPlainText({ configuration, text: 'Constructs a new instance of the ' }),
					new tsdoc.DocCodeSpan({
						configuration,
						code: classDeclaration.astSymbol.localName,
					}),
					new tsdoc.DocPlainText({ configuration, text: ' class' }),
				]);
				metadata.artificialDocComment = true;
			}

			const apiItemMetadata: ApiItemMetadata = this.#collector.fetchApiItemMetadata(astDeclaration);
			if (apiItemMetadata.effectiveReleaseTag === ReleaseTag.Internal) {
				// If the constructor is marked as internal, then add a boilerplate notice for the containing class
				const classMetadata: ApiItemMetadata = this.#collector.fetchApiItemMetadata(classDeclaration);

				if (!classMetadata.tsdocComment) {
					classMetadata.tsdocComment = new tsdoc.DocComment({ configuration });
				}

				if (classMetadata.tsdocComment.remarksBlock === undefined) {
					classMetadata.tsdocComment.remarksBlock = new tsdoc.DocBlock({
						configuration,
						blockTag: new tsdoc.DocBlockTag({
							configuration,
							tagName: tsdoc.StandardTags.remarks.tagName,
						}),
					});
				}

				classMetadata.tsdocComment.remarksBlock.content.appendNode(
					new tsdoc.DocParagraph({ configuration }, [
						new tsdoc.DocPlainText({
							configuration,
							text:
								`The constructor for this class is marked as internal. Third-party code should not` +
								` call the constructor directly or create subclasses that extend the `,
						}),
						new tsdoc.DocCodeSpan({
							configuration,
							code: classDeclaration.astSymbol.localName,
						}),
						new tsdoc.DocPlainText({ configuration, text: ' class.' }),
					]),
				);

				classMetadata.artificialDocComment = true;
			}

			return;
		}

		if (metadata.tsdocComment) {
			// Require the summary to contain at least 10 non-spacing characters
			metadata.undocumented = !tsdoc.PlainTextEmitter.hasAnyTextContent(metadata.tsdocComment.summarySection, 10);
		} else {
			metadata.undocumented = true;
		}
	}

	#checkForBrokenLinks(
		astDeclaration: AstDeclaration,
		metadata: ApiItemMetadata,
		entryPoint: IWorkingPackageEntryPoint,
	): void {
		if (!metadata.tsdocComment) {
			return;
		}

		this.#checkForBrokenLinksRecursive(astDeclaration, metadata.tsdocComment, entryPoint);
	}

	#checkForBrokenLinksRecursive(
		astDeclaration: AstDeclaration,
		node: tsdoc.DocNode,
		entryPoint: IWorkingPackageEntryPoint,
	): void {
		if (
			node instanceof tsdoc.DocLinkTag &&
			node.codeDestination && // Is it referring to the working package?  If not, we don't do any link validation, because
			// AstReferenceResolver doesn't support it yet (but ModelReferenceResolver does of course).
			// Tracked by:  https://github.com/microsoft/rushstack/issues/1195
			(node.codeDestination.packageName === undefined ||
				node.codeDestination.packageName === this.#collector.workingPackage.name)
		) {
			const referencedAstDeclaration: AstDeclaration | ResolverFailure = this.#collector.astReferenceResolver.resolve(
				node.codeDestination,
				entryPoint,
			);

			if (referencedAstDeclaration instanceof ResolverFailure) {
				this.#collector.messageRouter.addAnalyzerIssue(
					ExtractorMessageId.UnresolvedLink,
					'The @link reference could not be resolved: ' + referencedAstDeclaration.reason,
					astDeclaration,
				);
			}
		}

		for (const childNode of node.getChildNodes()) {
			this.#checkForBrokenLinksRecursive(astDeclaration, childNode, entryPoint);
		}
	}

	/**
	 * Follow an `{@inheritDoc ___}` reference and copy the content that we find in the referenced comment.
	 */
	#applyInheritDoc(
		astDeclaration: AstDeclaration,
		docComment: tsdoc.DocComment,
		inheritDocTag: tsdoc.DocInheritDocTag,
		entryPoint: IWorkingPackageEntryPoint,
	): void {
		if (!inheritDocTag.declarationReference) {
			this.#collector.messageRouter.addAnalyzerIssue(
				ExtractorMessageId.UnresolvedInheritDocBase,
				'The @inheritDoc tag needs a TSDoc declaration reference; signature matching is not supported yet',
				astDeclaration,
			);
			return;
		}

		// Is it referring to the working package?
		if (
			!(
				inheritDocTag.declarationReference.packageName === undefined ||
				inheritDocTag.declarationReference.packageName === this.#collector.workingPackage.name
			)
		) {
			// It's referencing an external package, so skip this inheritDoc tag, since AstReferenceResolver doesn't
			// support it yet.  As a workaround, this tag will get handled later by api-documenter.
			// Tracked by:  https://github.com/microsoft/rushstack/issues/1195
			return;
		}

		const referencedAstDeclaration: AstDeclaration | ResolverFailure = this.#collector.astReferenceResolver.resolve(
			inheritDocTag.declarationReference,
			entryPoint,
		);

		if (referencedAstDeclaration instanceof ResolverFailure) {
			this.#collector.messageRouter.addAnalyzerIssue(
				ExtractorMessageId.UnresolvedInheritDocReference,
				'The @inheritDoc reference could not be resolved: ' + referencedAstDeclaration.reason,
				astDeclaration,
			);
			return;
		}

		this.#analyzeApiItem(referencedAstDeclaration, entryPoint);

		const referencedMetadata: ApiItemMetadata = this.#collector.fetchApiItemMetadata(referencedAstDeclaration);

		if (referencedMetadata.tsdocComment) {
			this.#copyInheritedDocs(docComment, referencedMetadata.tsdocComment);
		}
	}

	/**
	 * Copy the content from `sourceDocComment` to `targetDocComment`.
	 */
	#copyInheritedDocs(targetDocComment: tsdoc.DocComment, sourceDocComment: tsdoc.DocComment): void {
		targetDocComment.summarySection = sourceDocComment.summarySection;
		targetDocComment.remarksBlock = sourceDocComment.remarksBlock;

		targetDocComment.params.clear();
		for (const param of sourceDocComment.params) {
			targetDocComment.params.add(param);
		}

		for (const typeParam of sourceDocComment.typeParams) {
			targetDocComment.typeParams.add(typeParam);
		}

		targetDocComment.returnsBlock = sourceDocComment.returnsBlock;

		targetDocComment.inheritDocTag = undefined;
	}
}
