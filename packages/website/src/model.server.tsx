import {
	ApiDeclaredItem,
	ApiDocumentedItem,
	ApiEntryPoint,
	ApiFunction,
	ApiItem,
	ApiItemKind,
	ApiModel,
	ApiNameMixin,
	ApiPackage,
	ApiPropertyItem,
	Excerpt,
	ExcerptToken,
	ExcerptTokenKind,
	Parameter,
} from '@microsoft/api-extractor-model';
import { DocNode, DocParagraph, DocPlainText, TSDocConfiguration } from '@microsoft/tsdoc';
import '@microsoft/tsdoc/schemas/tsdoc.schema.json'; // Try to work around vercel issue
import json from './discord.js.api.json';

const model = new ApiModel();
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const apiPackage = ApiItem.deserialize(json as any, {
	apiJsonFilename: '',
	toolPackage: json.metadata.toolPackage,
	toolVersion: json.metadata.toolVersion,
	versionToDeserialize: json.metadata.schemaVersion,
	tsdocConfiguration: new TSDocConfiguration(),
}) as ApiPackage;
model.addMember(apiPackage);

export function findPackage(name: string): ApiPackage | undefined {
	return model.findMembersByName(name)[0] as ApiPackage | undefined;
}

function generatePath(items: readonly ApiItem[]) {
	let path = '/docs/packages/';
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

	return path;
}

function resolveDocComment(item: ApiDocumentedItem) {
	if (!(item instanceof ApiDocumentedItem)) {
		return null;
	}

	const { tsdocComment } = item;

	if (!tsdocComment) {
		return null;
	}

	const { summarySection } = tsdocComment;

	function recurseNodes(nodes: readonly DocNode[] | undefined): string | null | undefined {
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
	}

	return recurseNodes(summarySection.nodes);
}

function findReferences(excerpt: Excerpt) {
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

export function createHyperlinkedExcerpt(excerpt: Excerpt) {
	const html: (JSX.Element | string)[] = [];
	for (const token of excerpt.spannedTokens) {
		switch (token.kind) {
			case ExcerptTokenKind.Content:
				html.push(token.text);
				break;
			case ExcerptTokenKind.Reference:
				html.push(<a href="google.com">{token.text}</a>);
				break;
		}
	}

	return ['1', '2', '3'];
}

function getProperties(item: ApiItem) {
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

function genReference(item: ApiItem) {
	return {
		name: resolveName(item),
		path: generatePath(item.getHierarchy()),
	};
}

function genToken(token: ExcerptToken) {
	const item = token.canonicalReference
		? model.resolveDeclarationReference(token.canonicalReference, undefined).resolvedApiItem ?? null
		: null;

	return {
		kind: token.kind,
		text: token.text,
		path: item ? generatePath(item.getHierarchy()) : null,
	};
}

function genParameter(param: Parameter): ParameterDocumentation {
	return {
		name: param.name,
		isOptional: param.isOptional,
		tokens: param.parameterTypeExcerpt.spannedTokens.map(genToken),
	};
}

export function findMember(packageName: string, memberName: string) {
	const pkg = findPackage(packageName)!;
	const member = (pkg.members[0] as ApiEntryPoint).findMembersByName(memberName)[0];

	if (!(member instanceof ApiDeclaredItem)) {
		return undefined;
	}

	const excerpt = (member as ApiFunction).excerpt;

	console.log(createHyperlinkedExcerpt(excerpt));

	return {
		name: resolveName(member),
		kind: member.kind,
		summary: resolveDocComment(member),
		excerpt: member.excerpt.text,
		tokens: member.excerpt.spannedTokens.map(genToken),
		refs: [...findReferences(member.excerpt).values()].map(genReference),
		members: getProperties(member).map((member) => member.excerpt.spannedTokens.map(genToken)),
		parameters: member instanceof ApiFunction ? member.parameters.map(genParameter) : [],
		foo: excerpt.spannedTokens.map(genToken),
	};
}

export function getMembers(pkg: ApiPackage) {
	return pkg.members[0]!.members.map((member) => ({
		name: member.displayName,
		path: generatePath(member.getHierarchy()),
	}));
}

export { model };
