import * as fs from 'node:fs';
import * as path from 'node:path';
import { ApiDeclaredItem, ApiItem, ApiItemContainerMixin, ApiModel } from '@microsoft/api-extractor-model';
import { DocCodeSpan, DocNode, DocNodeKind, DocParagraph, DocPlainText } from '@microsoft/tsdoc';
import { generatePath } from './parse';

export interface MemberJSON {
	name: string;
	kind: string;
	summary: string | null;
	path: string;
}

/**
 * Attempts to resolve the summary text for the given item.
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
			case DocNodeKind.Paragraph:
				return (node as DocParagraph).nodes.forEach(visitTSDocNode);
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

export function generateIndex(model: ApiModel, packageName: string, tag: string) {
	const members = visitNodes(model, tag);

	const dir = 'searchIndex';

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	fs.writeFile(
		path.join('searchIndex', `${packageName}-${tag}-doc-index.json`),
		JSON.stringify(members, undefined, 2),
		(err) => {
			if (err) {
				throw err;
			}
		},
	);
}
