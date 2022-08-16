import type { DocFencedCode } from '@microsoft/tsdoc';
import { DocNodeJSON, node } from './CommentNode';

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
