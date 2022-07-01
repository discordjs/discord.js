import type { ApiModel, ApiDeclaredItem } from '@microsoft/api-extractor-model';
import type { ReferenceData } from '~/model.server';
import { resolveName, genReference, resolveDocComment, TokenDocumentation, genToken } from '~/util/parse.server';

export class DocItem<T extends ApiDeclaredItem = ApiDeclaredItem> {
	public readonly item: T;
	public readonly name: string;
	public readonly referenceData: ReferenceData;
	public readonly summary: string | null;
	public readonly model: ApiModel;
	public readonly excerpt: string;
	public readonly excerptTokens: TokenDocumentation[] = [];
	public readonly kind: string;

	public constructor(model: ApiModel, item: T) {
		this.item = item;
		this.kind = item.kind;
		this.model = model;
		this.name = resolveName(item);
		this.referenceData = genReference(item);
		this.summary = resolveDocComment(item);
		this.excerpt = item.excerpt.text;
		this.excerptTokens = item.excerpt.spannedTokens.map((token) => genToken(model, token));
	}

	public toJSON() {
		return {
			name: this.name,
			referenceData: this.referenceData,
			summary: this.summary,
			excerpt: this.excerpt,
			excerptTokens: this.excerptTokens,
			kind: this.kind,
		};
	}
}
