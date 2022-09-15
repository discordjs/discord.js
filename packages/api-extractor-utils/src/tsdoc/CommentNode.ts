import type { DocNode, DocNodeKind } from '@microsoft/tsdoc';
import type { DocBlockJSON } from './CommentBlock.js';
import type { DocCodeSpanJSON } from './CommentCodeSpan.js';
import type { DocNodeContainerJSON } from './CommentNodeContainer.js';
import type { DocFencedCodeJSON } from './FencedCodeCommentNode.js';
import type { DocLinkTagJSON } from './LinkTagCommentNode.js';
import type { DocPlainTextJSON } from './PlainTextCommentNode.js';
import type { DocCommentJSON } from './RootComment.js';

export interface DocNodeJSON {
	kind: DocNodeKind;
}

export type AnyDocNodeJSON =
	| DocBlockJSON
	| DocCodeSpanJSON
	| DocCommentJSON
	| DocFencedCodeJSON
	| DocLinkTagJSON
	| DocNodeContainerJSON
	| DocNodeJSON
	| DocPlainTextJSON;

export function node(node: DocNode): DocNodeJSON {
	return {
		kind: node.kind as DocNodeKind,
	};
}
