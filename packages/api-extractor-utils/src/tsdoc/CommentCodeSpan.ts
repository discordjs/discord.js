import type { DocCodeSpan } from '@microsoft/tsdoc';
import { type DocNodeJSON, node } from './CommentNode.js';

export interface DocCodeSpanJSON extends DocNodeJSON {
	code: string;
}

export function codeSpan(codeSpan: DocCodeSpan): DocCodeSpanJSON {
	return {
		...node(codeSpan),
		code: codeSpan.code,
	};
}
