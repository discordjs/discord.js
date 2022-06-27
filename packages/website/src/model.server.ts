import path from 'path';
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
	ExcerptTokenKind,
} from '@microsoft/api-extractor-model';
import type { DocNode, DocParagraph, DocPlainText } from '@microsoft/tsdoc';

const model = new ApiModel();
model.loadPackage(path.join(__dirname, '..', 'src', 'discord.js.api.json'));

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

function resolveDocComment(item: ApiItem) {
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

export function findMember(packageName: string, memberName: string) {
	const pkg = findPackage(packageName)!;
	const member = (pkg.members[0] as ApiEntryPoint).findMembersByName(memberName)[0];

	if (!(member instanceof ApiDeclaredItem)) {
		return undefined;
	}

	const genReference = (items: readonly ApiItem[]) =>
		items.map((item) => ({
			name: resolveName(item),
			path: generatePath(item.getHierarchy()),
		}));

	return {
		name: resolveName(member),
		kind: member.kind,
		summary: resolveDocComment(member),
		excerpt: member.excerpt.text,
		refs: genReference([...findReferences(member.excerpt).values()]),
		members: getProperties(member).map((item) => item.excerpt.text),
		parameters: member instanceof ApiFunction ? member.parameters.map((parameter) => parameter.name) : [],
	};
}

export function getMembers(pkg: ApiPackage) {
	return pkg.members[0]!.members.map((member) => ({
		name: member.displayName,
		path: generatePath(member.getHierarchy()),
	}));
}

export { model };
