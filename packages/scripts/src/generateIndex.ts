import { stat, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { generatePath } from '@discordjs/api-extractor-utils';
import {
	ApiModel,
	ApiDeclaredItem,
	ApiItemContainerMixin,
	ApiItem,
	type ApiPackage,
	ApiItemKind,
} from '@microsoft/api-extractor-model';
import {
	DocNodeKind,
	type DocCodeSpan,
	type DocNode,
	type DocParagraph,
	type DocPlainText,
	TSDocConfiguration,
} from '@microsoft/tsdoc';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';
import { request } from 'undici';

export interface MemberJSON {
	kind: string;
	name: string;
	path: string;
	summary: string | null;
}

export const PACKAGES = [
	'brokers',
	'builders',
	'collection',
	'core',
	'formatters',
	'proxy',
	'rest',
	'util',
	'voice',
	'ws',
];
let idx = 0;

export function addPackageToModel(model: ApiModel, data: any) {
	const tsdocConfiguration = new TSDocConfiguration();
	const tsdocConfigFile = TSDocConfigFile.loadFromObject(data.metadata.tsdocConfig);
	tsdocConfigFile.configureParser(tsdocConfiguration);

	const apiPackage = ApiItem.deserialize(data, {
		apiJsonFilename: '',
		toolPackage: data.metadata.toolPackage,
		toolVersion: data.metadata.toolVersion,
		versionToDeserialize: data.metadata.schemaVersion,
		tsdocConfiguration,
	}) as ApiPackage;
	model.addMember(apiPackage);
	return model;
}

/**
 * Attempts to resolve the summary text for the given item.
 *
 * @param item - The API item to resolve the summary text for.
 */
export function tryResolveSummaryText(item: ApiDeclaredItem): string | null {
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
	const members: (MemberJSON & { id: number })[] = [];

	for (const member of item.members) {
		if (!(member instanceof ApiDeclaredItem)) {
			continue;
		}

		if (member.kind === ApiItemKind.Constructor) {
			continue;
		}

		if (ApiItemContainerMixin.isBaseClassOf(member)) {
			members.push(...visitNodes(member, tag));
		}

		members.push({
			id: idx++,
			name: member.displayName,
			kind: member.kind,
			summary: tryResolveSummaryText(member) ?? '',
			path: generatePath(member.getHierarchy(), tag),
		});
	}

	return members;
}

export async function generateIndex(model: ApiModel, packageName: string, tag = 'main') {
	const members = visitNodes(model.tryGetPackageByName(packageName)!.entryPoints[0]!, tag);

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

export async function generateAllIndices() {
	for (const pkg of PACKAGES) {
		const response = await request(`https://docs.discordjs.dev/api/info?package=${pkg}`);
		const versions = await response.body.json();

		for (const version of versions) {
			idx = 0;

			const versionRes = await request(`https://docs.discordjs.dev/docs/${pkg}/${version}.api.json`);
			const data = await versionRes.body.json();

			const model = addPackageToModel(new ApiModel(), data);
			await generateIndex(model, pkg, version);
		}
	}
}
