import type { ApiEnum } from '@microsoft/api-extractor-model';
import { VscSymbolEnum } from '@react-icons/all-files/vsc/VscSymbolEnum';
import { Documentation } from '../../documentation/Documentation';
import { EnumMember } from './EnumMember';
import { Panel } from '~/components/Panel';
import { ObjectHeader } from '~/components/documentation/ObjectHeader';
import { DocumentationSection } from '~/components/documentation/section/DocumentationSection';
import { SummarySection } from '~/components/documentation/section/SummarySection';

export function Enum({ item }: { item: ApiEnum }) {
	return (
		<Documentation>
			<ObjectHeader item={item} />
			<SummarySection item={item} />
			<DocumentationSection icon={<VscSymbolEnum size={20} />} padded title="Members">
				<div className="flex flex-col gap-4">
					{item.members.map((member, idx) => (
						<Panel key={`${member.displayName}-${idx}`}>
							<EnumMember member={member} />
						</Panel>
					))}
				</div>
			</DocumentationSection>
		</Documentation>
	);
}
