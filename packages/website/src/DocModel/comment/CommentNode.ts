import type { ApiItem, ApiModel } from '@microsoft/api-extractor-model';
import type { DocNode } from '@microsoft/tsdoc';

export class CommentNode<T extends DocNode = DocNode> {
	public readonly node: T;
	public readonly kind: string;
	public readonly model: ApiModel;
	public readonly parentItem: ApiItem | null;

	public constructor(node: T, model: ApiModel, parentItem?: ApiItem) {
		this.node = node;
		this.kind = node.kind;
		this.model = model;
		this.parentItem = parentItem ?? null;
	}

	public toJSON() {
		return {
			kind: this.kind,
		};
	}
}
