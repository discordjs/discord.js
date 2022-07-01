import type { ApiPropertyItem, ApiModel, ApiPropertySignature } from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';
import { type TokenDocumentation, genToken } from '~/util/parse.server';

export class DocProperty extends DocItem<ApiPropertyItem> {
	public readonly propertyTypeTokens: TokenDocumentation[];
	public readonly readonly: boolean;
	public readonly optional: boolean;

	public constructor(model: ApiModel, item: ApiPropertyItem | ApiPropertySignature) {
		super(model, item);
		this.propertyTypeTokens = item.propertyTypeExcerpt.spannedTokens.map((token) => genToken(this.model, token));
		this.readonly = item.isReadonly;
		this.optional = item.isOptional;
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			propertyTypeTokens: this.propertyTypeTokens,
			readonly: this.readonly,
			optional: this.optional,
		};
	}
}
