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
import { TypeParameterMixin } from './TypeParameterMixin';
import { type TokenDocumentation, genToken } from '~/util/parse.server';

export class DocClass extends TypeParameterMixin(DocItem<ApiClass>) {
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

		for (const member of item.findMembersWithInheritance().items) {
			switch (member.kind) {
				case ApiItemKind.Method: {
					const method = member as ApiMethod;

					if (method.parent?.containerKey !== this.containerKey) {
						this.methods.push(new DocMethod(this.model, method, true));
						break;
					}
					this.methods.push(new DocMethod(this.model, method));
					break;
				}
				case ApiItemKind.Property: {
					const property = member as ApiPropertyItem;

					if (property.parent?.containerKey !== this.containerKey) {
						this.properties.push(new DocProperty(this.model, property, true));
						break;
					}

					this.properties.push(new DocProperty(this.model, property));
					break;
				}
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
