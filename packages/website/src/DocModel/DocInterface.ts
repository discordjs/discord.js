import { DocItem } from './DocItem';
import { DocMethodSignature } from './DocMethodSignature';
import { DocProperty } from './DocProperty';
import { TypeParameterMixin } from './TypeParameterMixin';
import {
	ApiInterface,
	ApiItemKind,
	ApiMethodSignature,
	ApiModel,
	ApiPropertySignature,
} from '~/util/api-extractor.server';
import { type TokenDocumentation, genToken } from '~/util/parse.server';

export class DocInterface extends TypeParameterMixin(DocItem<ApiInterface>) {
	public readonly extendsTokens: TokenDocumentation[][] | null;
	public readonly methods: DocMethodSignature[] = [];
	public readonly properties: DocProperty[] = [];

	public constructor(model: ApiModel, item: ApiInterface) {
		super(model, item);

		this.extendsTokens = item.extendsTypes.map((excerpt) =>
			excerpt.excerpt.spannedTokens.map((token) => genToken(this.model, token)),
		);

		for (const member of item.findMembersWithInheritance().items) {
			switch (member.kind) {
				case ApiItemKind.MethodSignature: {
					const method = member as ApiMethodSignature;

					if (method.parent?.containerKey !== this.containerKey) {
						this.methods.push(new DocMethodSignature(this.model, method, true));
						break;
					}
					this.methods.push(new DocMethodSignature(this.model, method));
					break;
				}
				case ApiItemKind.PropertySignature: {
					const property = member as ApiPropertySignature;

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
			methods: this.methods.map((method) => method.toJSON()),
			properties: this.properties.map((prop) => prop.toJSON()),
		};
	}
}
