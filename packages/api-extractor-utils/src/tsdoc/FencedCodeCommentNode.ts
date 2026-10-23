import type { DocFencedCode } from '@microsoft/tsdoc';
import { type DocNodeJSON, node } from './CommentNode.js';

export interface DocFencedCodeJSON extends DocNodeJSON {
	code: string;
	language: string;
}

export function fencedCode(fencedCode: DocFencedCode) {
	return {
		...node(fencedCode),
		language: fencedCode.language,
		code: fencedCode.code,
	};
}
