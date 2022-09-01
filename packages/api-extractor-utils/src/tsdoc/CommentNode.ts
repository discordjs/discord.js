import type { DocNode, DocNodeKind } from '@microsoft/tsdoc';
import type { DocBlockJSON } from './CommentBlock';
import type { DocCodeSpanJSON } from './CommentCodeSpan';
import type { DocNodeContainerJSON } from './CommentNodeContainer';
import type { DocFencedCodeJSON } from './FencedCodeCommentNode';
import type { DocLinkTagJSON } from './LinkTagCommentNode';
import type { DocPlainTextJSON } from './PlainTextCommentNode';
import type { DocCommentJSON } from './RootComment';

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
