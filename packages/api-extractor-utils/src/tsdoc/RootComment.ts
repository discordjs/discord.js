import type { ApiItem, ApiModel } from '@microsoft/api-extractor-model';
import type { DocComment } from '@microsoft/tsdoc';
import { block, type DocBlockJSON } from './CommentBlock.js';
import { type DocNodeJSON, node } from './CommentNode.js';
import { createCommentNode } from './index.js';

export interface DocCommentJSON extends DocNodeJSON {
	customBlocks: DocBlockJSON[];
	deprecated: DocNodeJSON[];
	remarks: DocNodeJSON[];
	summary: DocNodeJSON[];
}

export function comment(comment: DocComment, model: ApiModel, version: string, parentItem?: ApiItem): DocCommentJSON {
	return {
		...node(comment),
		summary: comment.summarySection.nodes.map((node) => createCommentNode(node, model, version, parentItem)),
		remarks:
			comment.remarksBlock?.content.nodes.map((node) => createCommentNode(node, model, version, parentItem)) ?? [],
		deprecated:
			comment.deprecatedBlock?.content.nodes.map((node) => createCommentNode(node, model, version, parentItem)) ?? [],
		customBlocks: comment.customBlocks.map((_block) => block(_block, model, version, parentItem)),
	};
}
