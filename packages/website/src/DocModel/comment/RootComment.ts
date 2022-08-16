import type { ApiItem, ApiModel } from '@microsoft/api-extractor-model';
import type { DocComment } from '@microsoft/tsdoc';
import { createCommentNode } from '.';
import { block, DocBlockJSON } from './CommentBlock';
import { DocNodeJSON, node } from './CommentNode';

export interface DocCommentJSON extends DocNodeJSON {
	summary: DocNodeJSON[];
	remarks: DocNodeJSON[];
	customBlocks: DocBlockJSON[];
}

export function comment(comment: DocComment, model: ApiModel, parentItem?: ApiItem): DocCommentJSON {
	return {
		...node(comment),
		summary: comment.summarySection.nodes.map((node) => createCommentNode(node, model, parentItem)),
		remarks: comment.remarksBlock?.content.nodes.map((node) => createCommentNode(node, model, parentItem)) ?? [],
		customBlocks: comment.customBlocks.map((_block) => block(_block, model, parentItem)),
	};
}
