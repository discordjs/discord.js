import type { ApiModel, ApiTypeAlias } from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';
import { type TokenDocumentation, genToken } from '~/util/parse.server';

export class DocTypeAlias extends DocItem<ApiTypeAlias> {
	public readonly typeTokens: TokenDocumentation[];

	public constructor(model: ApiModel, item: ApiTypeAlias) {
		super(model, item);
		this.typeTokens = item.typeExcerpt.spannedTokens.map((token) => genToken(model, token));
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			typeTokens: this.typeTokens,
		};
	}
}
