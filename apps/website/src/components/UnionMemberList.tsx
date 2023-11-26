import { Excerpt, type ApiTypeAlias, type ExcerptToken } from '@discordjs/api-extractor-model';
import { useMemo } from 'react';
import { ExcerptText } from './ExcerptText';

export type UnionMember = ExcerptToken[];

export function UnionMemberList({ item, members }: { readonly item: ApiTypeAlias; readonly members: UnionMember[] }) {
	return useMemo(
		() =>
			members.map((member, idx) => (
				<div className="flex flex-row place-items-center gap-4" key={`union-${idx}`}>
					<span className="break-all font-mono space-y-2">
						<ExcerptText
							excerpt={new Excerpt(member, { startIndex: 0, endIndex: member.length })}
							apiPackage={item.getAssociatedPackage()!}
						/>
					</span>
				</div>
			)),
		[item, members],
	);
}
