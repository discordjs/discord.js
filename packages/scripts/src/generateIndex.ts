import { stat, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import {
	type ApiItem,
	ApiPackage,
	ApiModel,
	ApiDeclaredItem,
	ApiItemContainerMixin,
	ApiItemKind,
} from '@discordjs/api-extractor-model';
import { generatePath } from '@discordjs/api-extractor-utils';
import { DocNodeKind } from '@microsoft/tsdoc';
import type { DocLinkTag, DocCodeSpan, DocNode, DocParagraph, DocPlainText } from '@microsoft/tsdoc';
import { resolveMembers } from './generateSplitDocumentation.js';
import { PACKAGES, fetchVersionDocs, fetchVersions } from './shared.js';

export interface MemberJSON {
	kind: string;
	name: string;
	path: string;
	summary: string | null;
	type: number;
}

let idx = 0;

/**
 * Attempts to resolve the summary text for the given item.
 *
 * @param item - The API item to resolve the summary text for.
 */
export function tryResolveSummaryText(item: ApiDeclaredItem): string | null {
	if (!item?.tsdocComment) {
		return null;
	}

	const { summarySection } = item.tsdocComment;

	let retVal = '';

	// Recursively visit the nodes in the summary section.
	const visitTSDocNode = (node: DocNode) => {
		switch (node.kind) {
			case DocNodeKind.CodeSpan:
				retVal += (node as DocCodeSpan).code;
				break;
			case DocNodeKind.PlainText:
				retVal += (node as DocPlainText).text;
				break;
			case DocNodeKind.LinkTag: {
				const { codeDestination, urlDestination, linkText } = node as DocLinkTag;
				if (codeDestination) {
					const declarationReference = item.getAssociatedModel()?.resolveDeclarationReference(codeDestination, item);
					if (declarationReference?.resolvedApiItem) {
						const foundItem = declarationReference.resolvedApiItem;
						retVal += linkText ?? foundItem.displayName;
					} else {
						const typeName = codeDestination.memberReferences.map((ref) => ref.memberIdentifier?.identifier).join('.');
						retVal += typeName;
					}
				} else {
					retVal += linkText ?? urlDestination;
				}

				break;
			}

			case DocNodeKind.Section:
			case DocNodeKind.Paragraph: {
				for (const child of (node as DocParagraph).nodes) {
					visitTSDocNode(child);
				}

				break;
			}

			default: // We'll ignore all other nodes.
				break;
		}
	};

	for (const node of summarySection.nodes) {
		visitTSDocNode(node);
	}

	if (retVal === '') {
		return null;
	}

	return retVal;
}

export enum SearchOrderType {
	Class,
	Interface,
	TypeAlias,
	Function,
	Enum,
	Variable,
	Event,
	Method,
	Property,
	MethodSignature,
	PropertySignature,
	EnumMember,
	Package,
	Namespace,
	IndexSignature,
	CallSignature,
	Constructor,
	ConstructSignature,
	EntryPoint,
	Model,
	None,
}

export function visitNodes(item: ApiItem, tag: string) {
	const members: (MemberJSON & { id: number })[] = [];

	for (const { item: member, inherited } of ApiItemContainerMixin.isBaseClassOf(item)
		? resolveMembers(item, (child): child is ApiDeclaredItem => child instanceof ApiDeclaredItem)
		: []) {
		if (member.kind === ApiItemKind.Constructor || member.kind === ApiItemKind.Namespace) {
			continue;
		}

		members.push(...visitNodes(member, tag));

		members.push({
			id: idx++,
			name: member.displayName,
			kind: member.kind,
			summary: tryResolveSummaryText(member) ?? '',
			path: generatePath(inherited ? [...item.getHierarchy(), member] : member.getHierarchy(), tag),
			type: SearchOrderType[member.kind as keyof typeof SearchOrderType],
		});
	}

	return members;
}

export async function writeIndexToFileSystem(
	members: ReturnType<typeof visitNodes>,
	packageName: string,
	tag = 'main',
) {
	const dir = 'searchIndex';

	try {
		(await stat(join(cwd(), 'public', dir))).isDirectory();
	} catch {
		await mkdir(join(cwd(), 'public', dir));
	}

	await writeFile(
		join(cwd(), 'public', dir, `${packageName}-${tag}-index.json`),
		JSON.stringify(members, undefined, 2),
	);
}

export async function generateAllIndices({
	fetchPackageVersions = fetchVersions,
	fetchPackageVersionDocs = fetchVersionDocs,
	writeToFile = true,
} = {}) {
	const indices: Record<any, any>[] = [];

	for (const pkg of PACKAGES) {
		const versions = await fetchPackageVersions(pkg);

		for (const version of versions) {
			idx = 0;

			const data = await fetchPackageVersionDocs(pkg, version);
			const model = new ApiModel();
			model.addMember(ApiPackage.loadFromJson(data));
			const members = visitNodes(model.tryGetPackageByName(pkg)!.entryPoints[0]!, version);

			const sanitizePackageName = pkg.replaceAll('.', '-');
			const sanitizeVersion = version.replaceAll('.', '-');

			if (writeToFile) {
				await writeIndexToFileSystem(members, sanitizePackageName, sanitizeVersion);
			} else {
				indices.push({ index: `${sanitizePackageName}-${sanitizeVersion}`, data: members });
			}
		}
	}

	return indices;
}
