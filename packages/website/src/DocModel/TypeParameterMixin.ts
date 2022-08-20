import type { ApiItem, ApiModel, ApiTypeParameterListMixin, TypeParameter } from '@microsoft/api-extractor-model';
import type { DocItemConstructor } from './DocItem';
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

export function TypeParameterMixin<TBase extends DocItemConstructor>(Base: TBase) {
	return class Mixed extends Base {
		public readonly typeParameters: TypeParameterData[] = [];

		public constructor(...args: any[]);
		public constructor(model: ApiModel, item: ApiItem) {
			super(model, item);
			this.typeParameters = (item as ApiTypeParameterListMixin).typeParameters.map((typeParam) =>
				generateTypeParamData(this.model, typeParam, item.parent),
			);
		}

		public override toJSON() {
			return {
				...super.toJSON(),
				typeParameterData: this.typeParameters,
			};
		}
	};
}
