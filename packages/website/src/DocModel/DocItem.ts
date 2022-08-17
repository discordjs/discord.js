import type { ApiModel, ApiDeclaredItem } from '@microsoft/api-extractor-model';
import { createCommentNode } from './comment';
import type { AnyDocNodeJSON } from './comment/CommentNode';
import type { DocNodeContainerJSON } from './comment/CommentNodeContainer';
import type { ReferenceData } from '~/util/model.server';
import { resolveName, genReference, TokenDocumentation, genToken } from '~/util/parse.server';

export type DocItemConstructor<T = DocItem> = new (...args: any[]) => T;

export class DocItem<T extends ApiDeclaredItem = ApiDeclaredItem> {
	public readonly item: T;
	public readonly name: string;
	public readonly referenceData: ReferenceData;
	public readonly model: ApiModel;
	public readonly excerpt: string;
	public readonly excerptTokens: TokenDocumentation[] = [];
	public readonly kind: string;
	public readonly remarks: DocNodeContainerJSON | null;
	public readonly summary: DocNodeContainerJSON | null;
	public readonly deprecated: DocNodeContainerJSON | null;
	public readonly containerKey: string;
	public readonly comment: AnyDocNodeJSON | null;

	public constructor(model: ApiModel, item: T) {
		this.item = item;
		this.kind = item.kind;
		this.model = model;
		this.name = resolveName(item);
		this.referenceData = genReference(item);
		this.excerpt = item.excerpt.text;
		this.excerptTokens = item.excerpt.spannedTokens.map((token) => genToken(model, token));
		this.remarks = item.tsdocComment?.remarksBlock
			? (createCommentNode(item.tsdocComment.remarksBlock, model, item.parent) as DocNodeContainerJSON)
			: null;
		this.summary = item.tsdocComment?.summarySection
			? (createCommentNode(item.tsdocComment.summarySection, model, item.parent) as DocNodeContainerJSON)
			: null;
		this.deprecated = item.tsdocComment?.deprecatedBlock
			? (createCommentNode(item.tsdocComment.deprecatedBlock, model, item.parent) as DocNodeContainerJSON)
			: null;
		this.containerKey = item.containerKey;
		this.comment = item.tsdocComment ? createCommentNode(item.tsdocComment, model, item.parent) : null;
	}

	public get path() {
		const path = [];
		for (const item of this.item.getHierarchy()) {
			switch (item.kind) {
				case 'None':
				case 'EntryPoint':
				case 'Model':
					break;
				default:
					path.push(resolveName(item));
			}
		}

		return path;
	}

	public toJSON() {
		return {
			name: this.name,
			referenceData: this.referenceData,
			summary: this.summary,
			excerpt: this.excerpt,
			excerptTokens: this.excerptTokens,
			kind: this.kind,
			remarks: this.remarks,
			deprecated: this.deprecated,
			path: this.path,
			containerKey: this.containerKey,
			comment: this.comment,
		};
	}
}
