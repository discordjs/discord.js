import type { ApiTypeAlias } from '@discordjs/api-extractor-model';
import { VscSymbolArray } from '@react-icons/all-files/vsc/VscSymbolArray';
import type { UnionMember } from '~/components/UnionMemberList';
import { UnionMemberList } from '~/components/UnionMemberList';
import { DocumentationSection } from './DocumentationSection';

export function UnionMembersSection({
	item,
	members,
}: {
	readonly item: ApiTypeAlias;
	readonly members: UnionMember[];
}) {
	return (
		<DocumentationSection icon={<VscSymbolArray size={20} />} padded title="Union Members">
			<div className="flex flex-col gap-4">
				<UnionMemberList item={item} members={members} />
			</div>
		</DocumentationSection>
	);
}
