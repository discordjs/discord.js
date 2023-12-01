import { Excerpt, type ApiTypeAlias, type ExcerptToken } from '@discordjs/api-extractor-model';
import { VscSymbolArray } from '@react-icons/all-files/vsc/VscSymbolArray';
import { useMemo } from 'react';
import { ExcerptText } from '~/components/ExcerptText';
import { DocumentationSection } from './DocumentationSection';

export type UnionMember = ExcerptToken[];

export function UnionMembersSection({
	item,
	members,
}: {
	readonly item: ApiTypeAlias;
	readonly members: UnionMember[];
}) {
	const unionMembers = useMemo(
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

	return (
		<DocumentationSection icon={<VscSymbolArray size={20} />} padded title="Union Members">
			<div className="flex flex-col gap-4">{unionMembers}</div>
		</DocumentationSection>
	);
}
