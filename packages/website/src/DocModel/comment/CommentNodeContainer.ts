import type { ApiItem, ApiModel } from '@microsoft/api-extractor-model';
import type { DocNodeContainer } from '@microsoft/tsdoc';
import { createCommentNode } from '.';
import { CommentNode } from './CommentNode';

export class CommentNodeContainer<T extends DocNodeContainer = DocNodeContainer> extends CommentNode<DocNodeContainer> {
	public readonly nodes: CommentNode[];

	public constructor(container: T, model: ApiModel, parentItem?: ApiItem) {
		super(container, model, parentItem);
		this.nodes = container.nodes.map((node) => createCommentNode(node, model, parentItem));
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			nodes: this.nodes.map((node) => node.toJSON()),
		};
	}
}
