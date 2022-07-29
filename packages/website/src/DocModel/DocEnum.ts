import type { ApiEnum, ApiModel } from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';
import { CommentNodeContainer } from './comment/CommentNodeContainer';
import { genToken, TokenDocumentation } from '~/util/parse.server';

export interface EnumMemberData {
	name: string;
	initializerTokens: TokenDocumentation[];
	summary: ReturnType<DocItem['toJSON']>['summary'];
}

export class DocEnum extends DocItem<ApiEnum> {
	public readonly members: EnumMemberData[] = [];

	public constructor(model: ApiModel, item: ApiEnum) {
		super(model, item);

		this.members = item.members.map((member) => ({
			name: member.name,
			initializerTokens: member.initializerExcerpt?.spannedTokens.map((token) => genToken(this.model, token)) ?? [],
			summary: member.tsdocComment
				? new CommentNodeContainer(member.tsdocComment.summarySection, model, member).toJSON()
				: null,
		}));
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			members: this.members,
		};
	}
}
