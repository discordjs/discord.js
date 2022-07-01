import type { ApiEnum, ApiModel } from '@microsoft/api-extractor-model';
import { DocItem } from './DocItem';

export interface EnumMemberData {
	name: string;
}

export class DocEnum extends DocItem<ApiEnum> {
	public readonly members: EnumMemberData[] = [];

	public constructor(model: ApiModel, item: ApiEnum) {
		super(model, item);

		this.members = item.members.map((member) => ({
			name: member.name,
		}));
	}

	public override toJSON() {
		return {
			...super.toJSON(),
			members: this.members,
		};
	}
}
