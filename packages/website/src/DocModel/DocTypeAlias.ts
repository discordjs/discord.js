import type { ApiModel, ApiTypeAlias } from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';
import { type TokenDocumentation, genToken, generateTypeParamData, type TypeParameterData } from '~/util/parse.server';

export class DocTypeAlias extends DocItem<ApiTypeAlias> {
	public readonly typeTokens: TokenDocumentation[];
	public readonly typeParameters: TypeParameterData[] = [];

	public constructor(model: ApiModel, item: ApiTypeAlias) {
		super(model, item);
		this.typeTokens = item.typeExcerpt.spannedTokens.map((token) => genToken(model, token));
		this.typeParameters = item.typeParameters.map((typeParam) => generateTypeParamData(this.model, typeParam));
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			typeTokens: this.typeTokens,
			typeParameters: this.typeParameters,
		};
	}
}
