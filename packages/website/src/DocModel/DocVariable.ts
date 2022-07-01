import type { ApiModel, ApiVariable } from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';
import { genToken, TokenDocumentation } from '~/util/parse.server';

export class DocVariable extends DocItem<ApiVariable> {
	public readonly typeTokens: TokenDocumentation[] = [];
	public readonly readonly: boolean;

	public constructor(model: ApiModel, item: ApiVariable) {
		super(model, item);
		this.typeTokens = item.variableTypeExcerpt.spannedTokens.map((token) => genToken(model, token));
		this.readonly = item.isReadonly;
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			typeTokens: this.typeTokens,
			readonly: this.readonly,
		};
	}
}
