import { stat, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { generatePath } from '@discordjs/api-extractor-utils';
import { ApiDeclaredItem, ApiItemContainerMixin, type ApiItem, type ApiModel } from '@microsoft/api-extractor-model';
import { DocNodeKind, type DocCodeSpan, type DocNode, type DocParagraph, type DocPlainText } from '@microsoft/tsdoc';

export interface MemberJSON {
	kind: string;
	name: string;
	path: string;
	summary: string | null;
}

/**
 * Attempts to resolve the summary text for the given item.
 *
 * @param item - The API item to resolve the summary text for.
 */
function tryResolveSummaryText(item: ApiDeclaredItem): string | null {
	if (!item.tsdocComment) {
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

export function visitNodes(item: ApiItem, tag: string) {
	const members: MemberJSON[] = [];

	for (const member of item.members) {
		if (!(member instanceof ApiDeclaredItem)) {
			continue;
		}

		if (ApiItemContainerMixin.isBaseClassOf(member)) {
			members.push(...visitNodes(member, tag));
		}

		members.push({
			name: member.displayName,
			kind: member.kind,
			summary: tryResolveSummaryText(member),
			path: generatePath(member.getHierarchy(), tag),
		});
	}

	return members;
}

export async function generateIndex(model: ApiModel, packageName: string, tag: string) {
	const members = visitNodes(model, tag);

	const dir = 'searchIndex';

	if (!(await stat(dir)).isDirectory()) {
		await mkdir(dir);
	}

	await writeFile(join('searchIndex', `${packageName}-${tag}-doc-index.json`), JSON.stringify(members, undefined, 2));
}
