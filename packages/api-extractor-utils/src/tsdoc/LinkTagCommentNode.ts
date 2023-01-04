import type { ApiItem, ApiModel } from '@microsoft/api-extractor-model';
import type { DocDeclarationReference, DocLinkTag } from '@microsoft/tsdoc';
import { resolveName, generatePath } from '../parse.js';
import { type DocNodeJSON, node } from './CommentNode.js';

interface LinkTagCodeLink {
	kind: string;
	name: string;
	path: string;
}

export interface DocLinkTagJSON extends DocNodeJSON {
	codeDestination: LinkTagCodeLink | null;
	text: string | null;
	urlDestination: string | null;
}

export function genLinkToken(
	model: ApiModel,
	ref: DocDeclarationReference,
	context: ApiItem | null,
	version: string,
): LinkTagCodeLink | null {
	const item = model.resolveDeclarationReference(ref, context ?? undefined).resolvedApiItem ?? null;

	console.log(item);
	if (!item) {
		return null;
	}

	return {
		name: resolveName(item),
		kind: item.kind,
		path: generatePath(item.getHierarchy(), version),
	};
}

export function linkTagNode(
	linkNode: DocLinkTag,
	model: ApiModel,
	version: string,
	parentItem?: ApiItem,
): DocLinkTagJSON {
	// If we weren't provided a parent object, fallback to the package entrypoint.
	const packageEntryPoint = linkNode.codeDestination?.importPath
		? model.getAssociatedPackage()?.findEntryPointsByPath(linkNode.codeDestination.importPath)[0]
		: null;

	const codeDestination = linkNode.codeDestination
		? genLinkToken(model, linkNode.codeDestination, parentItem ?? packageEntryPoint ?? null, version)
		: null;
	const text = linkNode.linkText ?? null;
	const urlDestination = linkNode.urlDestination ?? null;

	return {
		...node(linkNode),
		text,
		codeDestination,
		urlDestination,
	};
}
