import type { ApiFunction, ApiModel, ApiParameterListMixin } from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';
import { TypeParameterMixin } from './TypeParameterMixin';
import { type TokenDocumentation, genToken, genParameter, ParameterDocumentation } from '~/util/parse.server';

export class DocFunction extends TypeParameterMixin(DocItem<ApiFunction>) {
	public readonly returnTypeTokens: TokenDocumentation[];
	public readonly overloadIndex: number;
	public readonly parameters: ParameterDocumentation[];

	public constructor(model: ApiModel, item: ApiFunction) {
		super(model, item);
		this.returnTypeTokens = item.returnTypeExcerpt.spannedTokens.map((token) => genToken(this.model, token));
		this.overloadIndex = item.overloadIndex;
		this.parameters = (item as ApiParameterListMixin).parameters.map((param) => genParameter(this.model, param));
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			parameters: this.parameters,
			returnTypeTokens: this.returnTypeTokens,
			overloadIndex: this.overloadIndex,
		};
	}
}
