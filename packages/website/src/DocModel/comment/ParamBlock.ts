import type { ApiItem, ApiModel } from '@microsoft/api-extractor-model';
import type { DocParamBlock } from '@microsoft/tsdoc';
import { block, DocBlockJSON } from './CommentBlock';

export interface DocParamBlockJSON extends DocBlockJSON {
	name: string;
}

export function paramBlock(paramBlock: DocParamBlock, model: ApiModel, parentItem?: ApiItem): DocParamBlockJSON {
	return {
		...block(paramBlock, model, parentItem),
		name: paramBlock.parameterName,
	};
}
