import type { ApiModel, ApiItem } from '@microsoft/api-extractor-model';
import type { DocFencedCode } from '@microsoft/tsdoc';
import { CommentNode } from './CommentNode';

export class FencedCodeCommentNode extends CommentNode<DocFencedCode> {
	public readonly code: string;
	public readonly language: string;

	public constructor(node: DocFencedCode, model: ApiModel, parentItem?: ApiItem) {
		super(node, model, parentItem);
		this.code = node.code;
		this.language = node.language;
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			code: this.code,
			language: this.language,
		};
	}
}
