import type { ApiFunction, ApiModel } from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';
import {
	type ParameterDocumentation,
	type TokenDocumentation,
	genParameter,
	genToken,
	type TypeParameterData,
	generateTypeParamData,
} from '~/util/parse.server';

export class DocFunction extends DocItem<ApiFunction> {
	public readonly parameters: ParameterDocumentation[];
	public readonly returnTypeTokens: TokenDocumentation[];
	public readonly overloadIndex: number;
	public readonly typeParameters: TypeParameterData[] = [];

	public constructor(model: ApiModel, item: ApiFunction) {
		super(model, item);
		this.parameters = item.parameters.map((param) => genParameter(this.model, param));
		this.returnTypeTokens = item.returnTypeExcerpt.spannedTokens.map((token) => genToken(this.model, token));
		this.overloadIndex = item.overloadIndex;
		this.typeParameters = item.typeParameters.map((typeParam) => generateTypeParamData(model, typeParam));
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			parameters: this.parameters,
			returnTypeTokens: this.returnTypeTokens,
			overloadIndex: this.overloadIndex,
			typeParameters: this.typeParameters,
		};
	}
}
