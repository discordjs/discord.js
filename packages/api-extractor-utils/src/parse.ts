import {
	type ApiModel,
	type ApiPackage,
	type ApiItem,
	ApiItemKind,
	type Excerpt,
	ExcerptTokenKind,
	ApiNameMixin,
	type ApiPropertyItem,
	type ExcerptToken,
	type Parameter,
	type ApiFunction,
	ApiDeclaredItem,
	type ApiMethod,
	type ApiMethodSignature,
} from '@discordjs/api-extractor-model';
import type { DocNode, DocParagraph, DocPlainText } from '@microsoft/tsdoc';
import { type Meaning, ModuleSource } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import type { DocBlockJSON } from './tsdoc/CommentBlock.js';
import { createCommentNode } from './tsdoc/index.js';

export function findPackage(model: ApiModel, name: string): ApiPackage | undefined {
	return (model.findMembersByName(name)[0] ?? model.findMembersByName(`@discordjs/${name}`)[0]) as
		| ApiPackage
		| undefined;
}

function hasOverloadIndex(item: ApiItem): item is ApiFunction | ApiMethod | ApiMethodSignature {
	return 'overloadIndex' in item;
}

export function generatePath(items: readonly ApiItem[], version: string) {
	let path = '/docs/packages';

	for (const item of items) {
		switch (item.kind) {
			case ApiItemKind.Model:
			case ApiItemKind.EntryPoint:
				break;
			case ApiItemKind.Package:
				path += `/${item.displayName}`;
				break;
			case ApiItemKind.Function:
				path += `/${item.displayName}${
					hasOverloadIndex(item) && item.overloadIndex > 1 ? `:${item.overloadIndex}` : ''
				}:${item.kind}`;
				break;
			case ApiItemKind.Method:
			case ApiItemKind.MethodSignature:
				path += `#${item.displayName}${
					hasOverloadIndex(item) && item.overloadIndex > 1 ? `:${item.overloadIndex}` : ''
				}`;
				break;
			case ApiItemKind.Property:
			case ApiItemKind.PropertySignature:
			case ApiItemKind.Event:
			case ApiItemKind.EnumMember:
				path += `#${item.displayName}`;
				break;
			default:
				path += `/${item.displayName}:${item.kind}`;
		}
	}

	return path.includes('@discordjs/')
		? path.replace(/@discordjs\/(?<package>.*)\/(?<member>.*)?/, `$<package>/${version}/$<member>`)
		: path.replace(/(?<package>.*)\/(?<member>.*)?/, `$<package>/${version}/$<member>`);
}

export function resolveDocComment(item: ApiDeclaredItem) {
	if (!(item instanceof ApiDeclaredItem)) {
		return null;
	}

	const { tsdocComment } = item;

	if (!tsdocComment) {
		return null;
	}

	const { summarySection } = tsdocComment;

	function recurseNodes(node: DocNode | undefined): string | null {
		if (!node) {
			return null;
		}

		switch (node.kind) {
			case 'Paragraph':
				return recurseNodes(node as DocParagraph);
			case 'PlainText':
				return (node as DocPlainText).text;
			default:
				return null;
		}
	}

	return recurseNodes(summarySection);
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
	kind: string;
	path: string | null;
	text: string;
}

export interface ParameterDocumentation {
	isOptional: boolean;
	name: string;
	paramCommentBlock: DocBlockJSON | null;
	tokens: TokenDocumentation[];
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
		// @ts-expect-error: Symbol is not publicly accessible
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
		? (model.resolveDeclarationReference(token.canonicalReference, undefined).resolvedApiItem ?? null)
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

export function getMembers(pkg: ApiPackage, version: string) {
	return pkg.members[0]!.members.map((member) => ({
		name: member.displayName,
		kind: member.kind as string,
		path: generatePath(member.getHierarchy(), version),
		containerKey: member.containerKey,
		overloadIndex: member.kind === 'Function' ? (member as ApiFunction).overloadIndex : null,
	}));
}
