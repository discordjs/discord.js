import type { ApiModel, ApiItem } from '@microsoft/api-extractor-model';
import type { DocBlock } from '@microsoft/tsdoc';
import { blockTag, type DocBlockTagJSON } from './CommentBlockTag.js';
import { type AnyDocNodeJSON, type DocNodeJSON, node } from './CommentNode.js';
import { createCommentNode } from './index.js';

export interface DocBlockJSON extends DocNodeJSON {
	content: AnyDocNodeJSON[];
	tag: DocBlockTagJSON;
}

export function block(block: DocBlock, model: ApiModel, version: string, parentItem?: ApiItem) {
	return {
		...node(block),
		content: block.content.nodes.map((node) => createCommentNode(node, model, version, parentItem)),
		tag: blockTag(block.blockTag),
	};
}
