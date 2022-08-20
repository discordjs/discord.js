import type { ApiItem, ApiModel } from '@microsoft/api-extractor-model';
import type { DocDeclarationReference, DocLinkTag } from '@microsoft/tsdoc';
import { DocNodeJSON, node } from './CommentNode';
import { generatePath, resolveName } from '~/util/parse.server';

export interface DocLinkTagJSON extends DocNodeJSON {
	text: string | null;
	codeDestination: LinkTagCodeLink | null;
	urlDestination: string | null;
}

export function genToken(
	model: ApiModel,
	ref: DocDeclarationReference,
	context: ApiItem | null,
): LinkTagCodeLink | null {
	const item = model.resolveDeclarationReference(ref, context ?? undefined).resolvedApiItem ?? null;

	if (!item) {
		return null;
	}

	return {
		name: resolveName(item),
		kind: item.kind,
		path: generatePath(item.getHierarchy()),
	};
}

export interface LinkTagCodeLink {
	name: string;
	kind: string;
	path: string;
}

export function linkTagNode(linkNode: DocLinkTag, model: ApiModel, parentItem?: ApiItem): DocLinkTagJSON {
	// If we weren't provided a parent object, fallback to the package entrypoint.
	const packageEntryPoint = linkNode.codeDestination?.importPath
		? model.getAssociatedPackage()?.findEntryPointsByPath(linkNode.codeDestination.importPath)[0]
		: null;

	const codeDestination = linkNode.codeDestination
		? genToken(model, linkNode.codeDestination, parentItem ?? packageEntryPoint ?? null)
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
