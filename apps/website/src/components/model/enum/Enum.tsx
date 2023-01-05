import type { ApiEnum } from '@microsoft/api-extractor-model';
import { VscSymbolEnum } from '@react-icons/all-files/vsc/VscSymbolEnum';
import { Documentation } from '../../documentation/Documentation';
import { EnumMember } from './EnumMember';
import { Panel } from '~/components/Panel';
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter';
import { SectionShell } from '~/components/documentation/section/SectionShell';
import { SummarySection } from '~/components/documentation/section/SummarySection';

export function Enum({ item }: { item: ApiEnum }) {
	return (
		<Documentation item={item}>
			<SyntaxHighlighter code={item.excerpt.text} />
			<SummarySection item={item} />
			<SectionShell icon={<VscSymbolEnum size={20} />} padded title="Members">
				<div className="flex flex-col gap-4">
					{item.members.map((member) => (
						<Panel key={member.containerKey}>
							<EnumMember member={member} />
						</Panel>
					))}
				</div>
			</SectionShell>
		</Documentation>
	);
}
