import {
	type ApiClass,
	type ApiModel,
	ApiItemKind,
	type ApiMethod,
	type ApiPropertyItem,
} from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';
import { DocMethod } from './DocMethod';
import { DocProperty } from './DocProperty';
import { type TokenDocumentation, genToken } from '~/util/parse.server';

export class DocClass extends DocItem<ApiClass> {
	public readonly extendsTokens: TokenDocumentation[] | null;
	public readonly implementsTokens: TokenDocumentation[][];
	public readonly methods: DocMethod[] = [];
	public readonly properties: DocProperty[] = [];

	public constructor(model: ApiModel, item: ApiClass) {
		super(model, item);
		const extendsExcerpt = item.extendsType?.excerpt;
		this.extendsTokens = extendsExcerpt
			? extendsExcerpt.spannedTokens.map((token) => genToken(this.model, token))
			: null;
		this.implementsTokens = item.implementsTypes.map((excerpt) =>
			excerpt.excerpt.spannedTokens.map((token) => genToken(this.model, token)),
		);

		for (const member of item.members) {
			switch (member.kind) {
				case ApiItemKind.Method:
					this.methods.push(new DocMethod(this.model, member as ApiMethod));
					break;
				case ApiItemKind.Property:
					this.properties.push(new DocProperty(this.model, member as ApiPropertyItem));
					break;
				default:
					break;
			}
		}
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			extendsTokens: this.extendsTokens,
			implementsTokens: this.implementsTokens,
			methods: this.methods.map((method) => method.toJSON()),
			properties: this.properties.map((prop) => prop.toJSON()),
		};
	}
}
