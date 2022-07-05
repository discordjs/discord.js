import type { ApiMethodSignature, ApiModel } from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';
import {
	type ParameterDocumentation,
	type TokenDocumentation,
	genParameter,
	genToken,
	generateTypeParamData,
	type TypeParameterData,
} from '~/util/parse.server';

export class DocMethodSignature extends DocItem<ApiMethodSignature> {
	public readonly parameters: ParameterDocumentation[];
	public readonly optional: boolean;
	public readonly returnTypeTokens: TokenDocumentation[];
	public readonly overloadIndex: number;
	public readonly typeParameters: TypeParameterData[] = [];

	public constructor(model: ApiModel, item: ApiMethodSignature) {
		super(model, item);
		this.parameters = item.parameters.map((param) => genParameter(this.model, param));
		this.optional = item.isOptional;
		this.returnTypeTokens = item.returnTypeExcerpt.spannedTokens.map((token) => genToken(this.model, token));
		this.overloadIndex = item.overloadIndex;
		this.typeParameters = item.typeParameters.map((typeParam) => generateTypeParamData(this.model, typeParam));
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			optional: this.optional,
			parameters: this.parameters,
			returnTypeTokens: this.returnTypeTokens,
			overloadIndex: this.overloadIndex,
		};
	}
}
