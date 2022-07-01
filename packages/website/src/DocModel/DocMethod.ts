import type { ApiMethod, ApiModel } from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';
import { Visibility } from './Visibility';
import { type ParameterDocumentation, type TokenDocumentation, genParameter, genToken } from '~/util/parse.server';

export class DocMethod extends DocItem<ApiMethod> {
	public readonly parameters: ParameterDocumentation[];
	public readonly static: boolean;
	public readonly optional: boolean;
	public readonly visibility: Visibility;
	public readonly returnTypeTokens: TokenDocumentation[];
	public readonly overloadIndex: number;

	public constructor(model: ApiModel, item: ApiMethod) {
		super(model, item);
		this.parameters = item.parameters.map((param) => genParameter(this.model, param));
		this.static = item.isStatic;
		this.optional = item.isOptional;
		this.visibility = item.isProtected ? Visibility.Protected : Visibility.Public;
		this.returnTypeTokens = item.returnTypeExcerpt.spannedTokens.map((token) => genToken(this.model, token));
		this.overloadIndex = item.overloadIndex;
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			static: this.static,
			optional: this.optional,
			visibility: this.visibility,
			parameters: this.parameters,
			returnTypeTokens: this.returnTypeTokens,
			overloadIndex: this.overloadIndex,
		};
	}
}
