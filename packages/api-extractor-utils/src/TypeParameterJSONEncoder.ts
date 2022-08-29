import type { TypeParameter, ApiModel, ApiItem } from '@microsoft/api-extractor-model';
import { type TokenDocumentation, genToken } from './parse';
import { type DocBlockJSON, block } from './tsdoc/CommentBlock';

export interface TypeParameterData {
	name: string;
	constraintTokens: TokenDocumentation[];
	defaultTokens: TokenDocumentation[];
	optional: boolean;
	commentBlock: DocBlockJSON | null;
}

export function generateTypeParamData(
	model: ApiModel,
	typeParam: TypeParameter,
	version: string,
	parentItem?: ApiItem,
): TypeParameterData {
	const constraintTokens = typeParam.constraintExcerpt.spannedTokens.map((token) => genToken(model, token, version));
	const defaultTokens = typeParam.defaultTypeExcerpt.spannedTokens.map((token) => genToken(model, token, version));

	return {
		name: typeParam.name,
		constraintTokens,
		defaultTokens,
		optional: typeParam.isOptional,
		commentBlock: typeParam.tsdocTypeParamBlock
			? block(typeParam.tsdocTypeParamBlock, model, version, parentItem)
			: null,
	};
}
