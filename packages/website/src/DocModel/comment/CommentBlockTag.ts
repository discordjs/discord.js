import type { DocBlockTag } from '@microsoft/tsdoc';
import { type DocNodeJSON, node } from './CommentNode';

export interface DocBlockTagJSON extends DocNodeJSON {
	tagName: string;
}

export function blockTag(blockTag: DocBlockTag): DocBlockTagJSON {
	return {
		...node(blockTag),
		tagName: blockTag.tagName,
	};
}
