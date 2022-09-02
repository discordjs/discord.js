import type { ApiItem, ApiModel } from '@microsoft/api-extractor-model';
import type { DocNodeContainer } from '@microsoft/tsdoc';
import { type AnyDocNodeJSON, type DocNodeJSON, node } from './CommentNode.js';
import { createCommentNode } from '.';

export interface DocNodeContainerJSON extends DocNodeJSON {
	nodes: AnyDocNodeJSON[];
}

export function nodeContainer(
	container: DocNodeContainer,
	model: ApiModel,
	version: string,
	parentItem?: ApiItem,
): DocNodeContainerJSON {
	return {
		...node(container),
		nodes: container.nodes.map((node) => createCommentNode(node, model, version, parentItem)),
	};
}
