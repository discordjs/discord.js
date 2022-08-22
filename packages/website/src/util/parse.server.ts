import {
	type ApiModel,
	type ApiPackage,
	type ApiItem,
	ApiItemKind,
	ApiDocumentedItem,
	type Excerpt,
	ExcerptTokenKind,
	ApiNameMixin,
	type ApiPropertyItem,
	type ExcerptToken,
	type Parameter,
	ApiFunction,
} from '@microsoft/api-extractor-model';
import type { DocNode, DocParagraph, DocPlainText } from '@microsoft/tsdoc';
import { Meaning, ModuleSource } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import { createCommentNode } from '~/DocModel/comment';
import type { DocBlockJSON } from '~/DocModel/comment/CommentBlock';

export function findPackage(model: ApiModel, name: string): ApiPackage | undefined {
	return (model.findMembersByName(name)[0] ?? model.findMembersByName(`@discordjs/${name}`)[0]) as
		| ApiPackage
		| undefined;
}

export function generatePath(items: readonly ApiItem[], version: string) {
	let path = '/docs/packages';
	for (const item of items) {
		switch (item.kind) {
			case ApiItemKind.Model:
			case ApiItemKind.EntryPoint:
			case ApiItemKind.EnumMember:
				break;
			case ApiItemKind.Package:
				path += `/${item.displayName}`;
				break;
			case ApiItemKind.Function:
				// eslint-disable-next-line no-case-declarations
				const functionItem = item as ApiFunction;
				path += `/${functionItem.displayName}${
					functionItem.overloadIndex && functionItem.overloadIndex > 1 ? `:${functionItem.overloadIndex}` : ''
				}`;
				break;
			case ApiItemKind.Property:
			case ApiItemKind.Method:
			case ApiItemKind.MethodSignature:
			case ApiItemKind.PropertySignature:
				// TODO: Take overloads into account
				path += `#${item.displayName}`;
				break;
			default:
				path += `/${item.displayName}`;
		}
	}

	return path.replace(/@discordjs\/(.*)\/(.*)?/, `$1/${version}/$2`);
}

export function resolveDocComment(item: ApiDocumentedItem) {
	if (!(item instanceof ApiDocumentedItem)) {
		return null;
	}

	const { tsdocComment } = item;

	if (!tsdocComment) {
		return null;
	}

	const { summarySection } = tsdocComment;

	function recurseNodes(nodes: readonly DocNode[] | undefined): string | null {
		if (!nodes) {
			return null;
		}

		for (const node of nodes) {
			switch (node.kind) {
				case 'Paragraph':
					return recurseNodes((node as DocParagraph).nodes);
				case 'PlainText':
					return (node as DocPlainText).text;
				default:
					return null;
			}
		}

		return null;
	}

	return recurseNodes(summarySection.nodes);
}

export function findReferences(model: ApiModel, excerpt: Excerpt) {
	const retVal: Set<ApiItem> = new Set();

	for (const token of excerpt.spannedTokens) {
		switch (token.kind) {
			case ExcerptTokenKind.Reference: {
				const item = model.resolveDeclarationReference(token.canonicalReference!, undefined).resolvedApiItem;
				if (!item) {
					break;
				}

				retVal.add(item);

				break;
			}
			default:
				break;
		}
	}

	return retVal;
}

export function resolveName(item: ApiItem) {
	if (ApiNameMixin.isBaseClassOf(item)) {
		return item.name;
	}

	return item.displayName;
}

export function getProperties(item: ApiItem) {
	const properties: ApiPropertyItem[] = [];
	for (const member of item.members) {
		switch (member.kind) {
			case ApiItemKind.Property:
			case ApiItemKind.PropertySignature:
			case ApiItemKind.Method:
			case ApiItemKind.MethodSignature:
				properties.push(member as ApiPropertyItem);
				break;
			default:
				break;
		}
	}

	return properties;
}

export interface TokenDocumentation {
	text: string;
	path: string | null;
	kind: string;
}

export interface ParameterDocumentation {
	name: string;
	isOptional: boolean;
	tokens: TokenDocumentation[];
	paramCommentBlock: DocBlockJSON | null;
}

function createDapiTypesURL(meaning: Meaning, name: string) {
	const base = 'https://discord-api-types.dev/api/discord-api-types-v10';

	switch (meaning) {
		case 'type':
			return `${base}#${name}`;
		default:
			return `${base}/${meaning}/${name}`;
	}
}

export function genReference(item: ApiItem, version: string) {
	return {
		name: resolveName(item),
		path: generatePath(item.getHierarchy(), version),
	};
}

export function genToken(model: ApiModel, token: ExcerptToken, version: string) {
	if (token.canonicalReference) {
		// @ts-expect-error
		token.canonicalReference._navigation = '.';
	}

	if (
		token.canonicalReference?.source instanceof ModuleSource &&
		token.canonicalReference.symbol &&
		token.canonicalReference.source.packageName === 'discord-api-types' &&
		token.canonicalReference.symbol.meaning
	) {
		return {
			kind: token.kind,
			text: token.text,
			path: createDapiTypesURL(token.canonicalReference.symbol.meaning, token.text),
		};
	}

	const item = token.canonicalReference
		? model.resolveDeclarationReference(token.canonicalReference, undefined).resolvedApiItem ?? null
		: null;

	return {
		kind: token.kind,
		text: token.text,
		path: item ? generatePath(item.getHierarchy(), version) : null,
	};
}

export function genParameter(model: ApiModel, param: Parameter, version: string): ParameterDocumentation {
	return {
		name: param.name,
		isOptional: param.isOptional,
		tokens: param.parameterTypeExcerpt.spannedTokens.map((token) => genToken(model, token, version)),
		paramCommentBlock: param.tsdocParamBlock
			? (createCommentNode(param.tsdocParamBlock, model, version) as DocBlockJSON)
			: null,
	};
}

export function getMembers(pkg: ApiPackage, version = 'main') {
	return pkg.members[0]!.members.map((member) => ({
		name: member.displayName,
		kind: member.kind as string,
		path: generatePath(member.getHierarchy(), version),
		containerKey: member.containerKey,
		overloadIndex: member.kind === 'Function' ? (member as ApiFunction).overloadIndex : null,
	}));
}
