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
	if (!context) {
		return null;
	}

	const item = model.resolveDeclarationReference(ref, context).resolvedApiItem ?? null;

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
	const codeDestination =
		linkNode.codeDestination && parentItem ? genToken(model, linkNode.codeDestination, parentItem) : null;
	const text = linkNode.linkText ?? null;
	const urlDestination = linkNode.urlDestination ?? null;

	return {
		...node(linkNode),
		text,
		codeDestination,
		urlDestination,
	};
}
