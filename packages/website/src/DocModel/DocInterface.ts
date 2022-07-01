import { DocItem } from './DocItem';
import { DocMethodSignature } from './DocMethodSignature';
import { DocProperty } from './DocProperty';
import { ApiInterface, ApiItemKind, ApiMethodSignature, ApiModel, ApiPropertySignature } from '~/api-extractor.server';
import { type TokenDocumentation, genToken } from '~/util/parse.server';

export class DocInterface extends DocItem<ApiInterface> {
	public readonly extendsTokens: TokenDocumentation[][] | null;
	public readonly methods: DocMethodSignature[] = [];
	public readonly properties: DocProperty[] = [];

	public constructor(model: ApiModel, item: ApiInterface) {
		super(model, item);

		this.extendsTokens = item.extendsTypes.map((excerpt) =>
			excerpt.excerpt.spannedTokens.map((token) => genToken(this.model, token)),
		);

		for (const member of item.members) {
			switch (member.kind) {
				case ApiItemKind.MethodSignature:
					this.methods.push(new DocMethodSignature(this.model, member as ApiMethodSignature));
					break;
				case ApiItemKind.PropertySignature:
					this.properties.push(new DocProperty(this.model, member as ApiPropertySignature));
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
			methods: this.methods.map((method) => method.toJSON()),
			properties: this.properties.map((prop) => prop.toJSON()),
		};
	}
}
