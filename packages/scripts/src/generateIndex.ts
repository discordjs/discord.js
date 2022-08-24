import * as fs from 'node:fs';
import * as path from 'node:path';
import {
	ApiDeclaredItem,
	ApiFunction,
	ApiItem,
	ApiItemContainerMixin,
	ApiItemKind,
	ApiModel,
} from '@microsoft/api-extractor-model';
import { DocCodeSpan, DocNode, DocNodeKind, DocParagraph, DocPlainText } from '@microsoft/tsdoc';

interface MemberJSON {
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

function generatePath(items: readonly ApiItem[]) {
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

	return path.replace(/@discordjs\/(.*)\/(.*)?/, '$1/{BRANCH}/$2');
}

export function visitNodes(model: ApiItem) {
	const members: MemberJSON[] = [];

	for (const member of model.members) {
		if (!(member instanceof ApiDeclaredItem)) {
			continue;
		}

		if (ApiItemContainerMixin.isBaseClassOf(member)) {
			members.push(...visitNodes(member));
		}

		members.push({
			name: member.displayName,
			kind: member.kind,
			summary: tryResolveSummaryText(member),
			path: generatePath(member.getHierarchy()),
		});
	}

	return members;
}

const packageNames = ['builders', 'voice', 'rest', 'ws', 'proxy', 'collection'];

const model = new ApiModel();

const dir = 'searchIndex';

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

const members = packageNames.reduce<MemberJSON[]>((acc, pkg) => {
	model.loadPackage(path.join('..', pkg, 'docs', 'docs.api.json'));
	return acc.concat(visitNodes(model.tryGetPackageByName(pkg)!.entryPoints[0]!));
}, []);

fs.writeFile(path.join('searchIndex', 'doc-index.json'), JSON.stringify(members, undefined, 2), (err) => {
	if (err) {
		throw err;
	}
});
