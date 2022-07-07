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
	type TypeParameter,
} from '@microsoft/api-extractor-model';
import type { DocNode, DocParagraph, DocPlainText } from '@microsoft/tsdoc';

export function findPackage(model: ApiModel, name: string): ApiPackage | undefined {
	return (model.findMembersByName(name)[0] ?? model.findMembersByName(`@discordjs/${name}`)[0]) as
		| ApiPackage
		| undefined;
}

function generatePath(items: readonly ApiItem[]) {
	let path = '/docs/main/packages/';
	for (const item of items) {
		switch (item.kind) {
			case ApiItemKind.Model:
			case ApiItemKind.EntryPoint:
			case ApiItemKind.EnumMember:
				break;
			case ApiItemKind.Package:
				path += `${item.displayName}/`;
				break;
			default:
				path += `${item.displayName}/`;
		}
	}

	return path.replace(/@discordjs\//, '');
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
}

export function genReference(item: ApiItem) {
	return {
		name: resolveName(item),
		path: generatePath(item.getHierarchy()),
	};
}

export function genToken(model: ApiModel, token: ExcerptToken) {
	const item = token.canonicalReference
		? model.resolveDeclarationReference(token.canonicalReference, undefined).resolvedApiItem ?? null
		: null;

	return {
		kind: token.kind,
		text: token.text,
		path: item ? generatePath(item.getHierarchy()) : null,
	};
}

export function genParameter(model: ApiModel, param: Parameter): ParameterDocumentation {
	return {
		name: param.name,
		isOptional: param.isOptional,
		tokens: param.parameterTypeExcerpt.spannedTokens.map((token) => genToken(model, token)),
	};
}

export function getMembers(pkg: ApiPackage) {
	return pkg.members[0]!.members.map((member) => ({
		name: member.displayName,
		kind: member.kind,
		path: generatePath(member.getHierarchy()),
	}));
}

export interface TypeParameterData {
	name: string;
	constraintTokens: TokenDocumentation[];
	defaultTokens: TokenDocumentation[];
	optional: boolean;
}

export function generateTypeParamData(model: ApiModel, typeParam: TypeParameter): TypeParameterData {
	const constraintTokens = typeParam.constraintExcerpt.spannedTokens.map((token) => genToken(model, token));
	const defaultTokens = typeParam.defaultTypeExcerpt.spannedTokens.map((token) => genToken(model, token));

	return {
		name: typeParam.name,
		constraintTokens,
		defaultTokens,
		optional: typeParam.isOptional,
	};
}
