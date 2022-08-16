import type { ApiModel, ApiItem } from '@microsoft/api-extractor-model';
import type { DocBlock } from '@microsoft/tsdoc';
import { createCommentNode } from '.';
import { blockTag, DocBlockTagJSON } from './CommentBlockTag';
import { AnyDocNodeJSON, DocNodeJSON, node } from './CommentNode';

export interface DocBlockJSON extends DocNodeJSON {
	content: AnyDocNodeJSON[];
	tag: DocBlockTagJSON;
}

export function block(block: DocBlock, model: ApiModel, parentItem?: ApiItem) {
	return {
		...node(block),
		content: block.content.nodes.map((node) => createCommentNode(node, model, parentItem)),
		tag: blockTag(block.blockTag),
	};
}
