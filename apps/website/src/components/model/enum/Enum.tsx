import type { ApiEnum } from '@microsoft/api-extractor-model';
import { VscSymbolEnum } from '@react-icons/all-files/vsc/VscSymbolEnum';
import { Panel } from '../../Panel';
import { Documentation } from '../../documentation/Documentation';
import { ObjectHeader } from '../../documentation/ObjectHeader';
import { DocumentationSection } from '../../documentation/section/DocumentationSection';
import { SummarySection } from '../../documentation/section/SummarySection';
import { EnumMember } from './EnumMember';

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
