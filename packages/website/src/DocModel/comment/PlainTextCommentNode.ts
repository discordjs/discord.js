import type { DocPlainText } from '@microsoft/tsdoc';
import { DocNodeJSON, node } from './CommentNode';

export interface DocPlainTextJSON extends DocNodeJSON {
	text: string;
}

export function plainTextNode(plainTextNode: DocPlainText): DocPlainTextJSON {
	return {
		...node(plainTextNode),
		text: plainTextNode.text,
	};
}
