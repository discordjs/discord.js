import type { DocCodeSpan } from '@microsoft/tsdoc';
import { DocNodeJSON, node } from './CommentNode';

export interface DocCodeSpanJSON extends DocNodeJSON {
	code: string;
}

export function codeSpan(codeSpan: DocCodeSpan): DocCodeSpanJSON {
	return {
		...node(codeSpan),
		code: codeSpan.code,
	};
}
