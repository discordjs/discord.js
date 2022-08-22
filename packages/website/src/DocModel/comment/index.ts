import type { ApiModel, ApiItem } from '@microsoft/api-extractor-model';
import {
	type DocNode,
	type DocPlainText,
	type DocLinkTag,
	type DocParagraph,
	type DocFencedCode,
	DocNodeKind,
	type DocBlock,
	DocComment,
	DocCodeSpan,
	DocParamBlock,
} from '@microsoft/tsdoc';
import { block } from './CommentBlock';
import { codeSpan } from './CommentCodeSpan';
import type { AnyDocNodeJSON } from './CommentNode';
import { node as _node } from './CommentNode';
import { nodeContainer } from './CommentNodeContainer';
import { fencedCode } from './FencedCodeCommentNode';
import { linkTagNode } from './LinkTagCommentNode';
import { paramBlock } from './ParamBlock';
import { plainTextNode } from './PlainTextCommentNode';
import { comment } from './RootComment';

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
