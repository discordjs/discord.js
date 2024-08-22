import type { DocPlainText } from '@microsoft/tsdoc';
import { type DocNodeJSON, node } from './CommentNode.js';

export interface DocPlainTextJSON extends DocNodeJSON {
	text: string;
}

export function plainTextNode(plainTextNode: DocPlainText): DocPlainTextJSON {
	return {
		...node(plainTextNode),
		text: plainTextNode.text,
	};
}
