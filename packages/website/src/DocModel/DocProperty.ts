import type { ApiPropertyItem, ApiModel, ApiPropertySignature } from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';
import type { InheritanceData } from './DocMethod';
import { type TokenDocumentation, genToken, generatePath } from '~/util/parse.server';

export class DocProperty extends DocItem<ApiPropertyItem> {
	public readonly propertyTypeTokens: TokenDocumentation[];
	public readonly readonly: boolean;
	public readonly optional: boolean;
	public readonly inheritanceData: InheritanceData | null;

	public constructor(model: ApiModel, item: ApiPropertyItem | ApiPropertySignature, inherited = false) {
		super(model, item);
		this.propertyTypeTokens = item.propertyTypeExcerpt.spannedTokens.map((token) => genToken(this.model, token));
		this.readonly = item.isReadonly;
		this.optional = item.isOptional;
		this.inheritanceData =
			inherited && item.parent
				? {
						parentName: item.parent.displayName,
						path: generatePath(item.parent.getHierarchy()),
				  }
				: null;
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			propertyTypeTokens: this.propertyTypeTokens,
			readonly: this.readonly,
			optional: this.optional,
			inheritanceData: this.inheritanceData,
		};
	}
}
