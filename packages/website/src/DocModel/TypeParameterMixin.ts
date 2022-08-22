import type { ApiItem, ApiModel, TypeParameter } from '@microsoft/api-extractor-model';
import { block, DocBlockJSON } from './comment/CommentBlock';
import { genToken, TokenDocumentation } from '~/util/parse.server';

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
	parentItem?: ApiItem,
): TypeParameterData {
	const constraintTokens = typeParam.constraintExcerpt.spannedTokens.map((token) => genToken(model, token));
	const defaultTokens = typeParam.defaultTypeExcerpt.spannedTokens.map((token) => genToken(model, token));

	return {
		name: typeParam.name,
		constraintTokens,
		defaultTokens,
		optional: typeParam.isOptional,
		commentBlock: typeParam.tsdocTypeParamBlock ? block(typeParam.tsdocTypeParamBlock, model, parentItem) : null,
	};
}
