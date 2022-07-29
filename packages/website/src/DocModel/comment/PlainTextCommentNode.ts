import type { ApiItem, ApiModel } from '@microsoft/api-extractor-model';
import type { DocPlainText } from '@microsoft/tsdoc';
import { CommentNode } from './CommentNode';

export class PlainTextCommentNode extends CommentNode<DocPlainText> {
	public readonly text: string;

	public constructor(node: DocPlainText, model: ApiModel, parentItem?: ApiItem) {
		super(node, model, parentItem);
		this.text = node.text;
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			text: this.text,
		};
	}
}
