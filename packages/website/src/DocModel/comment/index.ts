import type { ApiModel, ApiItem } from '@microsoft/api-extractor-model';
import type { DocNode, DocPlainText, DocLinkTag, DocParagraph, DocFencedCode } from '@microsoft/tsdoc';
import { CommentNode } from './CommentNode';
import { CommentNodeContainer } from './CommentNodeContainer';
import { FencedCodeCommentNode } from './FencedCodeCommentNode';
import { LinkTagCommentNode } from './LinkTagCommentNode';
import { PlainTextCommentNode } from './PlainTextCommentNode';

export function createCommentNode(node: DocNode, model: ApiModel, parentItem?: ApiItem): CommentNode {
	switch (node.kind) {
		case 'PlainText':
			return new PlainTextCommentNode(node as DocPlainText, model, parentItem);
		case 'LinkTag':
			return new LinkTagCommentNode(node as DocLinkTag, model, parentItem);
		case 'Paragraph':
			return new CommentNodeContainer(node as DocParagraph, model, parentItem);
		case 'FencedCode':
			return new FencedCodeCommentNode(node as DocFencedCode, model, parentItem);
		default:
			return new CommentNode(node, model, parentItem);
	}
}
