import type { ApiModel, ApiItem } from '@microsoft/api-extractor-model';
import {
	type DocNode,
	type DocPlainText,
	type DocLinkTag,
	type DocParagraph,
	type DocFencedCode,
	DocNodeKind,
	type DocBlock,
	type DocComment,
	type DocCodeSpan,
	type DocParamBlock,
} from '@microsoft/tsdoc';
import { block } from './CommentBlock.js';
import { codeSpan } from './CommentCodeSpan.js';
import { node as _node, type AnyDocNodeJSON } from './CommentNode.js';
import { nodeContainer } from './CommentNodeContainer.js';
import { fencedCode } from './FencedCodeCommentNode.js';
import { linkTagNode } from './LinkTagCommentNode.js';
import { paramBlock } from './ParamBlock.js';
import { plainTextNode } from './PlainTextCommentNode.js';
import { comment } from './RootComment.js';

export function createCommentNode(
	node: DocNode,
	model: ApiModel,
	version: string,
	parentItem?: ApiItem,
): AnyDocNodeJSON {
	switch (node.kind) {
		case DocNodeKind.PlainText:
			return plainTextNode(node as DocPlainText);
		case DocNodeKind.LinkTag:
			return linkTagNode(node as DocLinkTag, model, version, parentItem);
		case DocNodeKind.Paragraph:
		case DocNodeKind.Section:
			return nodeContainer(node as DocParagraph, model, version, parentItem);
		case DocNodeKind.FencedCode:
			return fencedCode(node as DocFencedCode);
		case DocNodeKind.CodeSpan:
			return codeSpan(node as DocCodeSpan);
		case DocNodeKind.Block:
			return block(node as DocBlock, model, version, parentItem);
		case DocNodeKind.ParamBlock:
			return paramBlock(node as DocParamBlock, model, version, parentItem);
		case DocNodeKind.Comment:
			return comment(node as DocComment, model, version, parentItem);
		default:
			return _node(node);
	}
}

export * from './CommentNode.js';
export * from './CommentNodeContainer.js';
export * from './CommentBlock.js';
export * from './CommentBlockTag.js';
export * from './CommentCodeSpan.js';
export * from './FencedCodeCommentNode.js';
export * from './LinkTagCommentNode.js';
export * from './ParamBlock.js';
export * from './PlainTextCommentNode.js';
export * from './RootComment.js';
