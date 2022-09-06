import type { ApiEnumJSON } from '@discordjs/api-extractor-utils';
import { VscSymbolEnumMember } from 'react-icons/vsc';
import { useMedia } from 'react-use';
import { CodeListing, CodeListingSeparatorType } from '../CodeListing';
import { DocContainer } from '../DocContainer';
import { Section } from '../Section';

export function Enum({ data }: { data: ApiEnumJSON }) {
	const matches = useMedia('(max-width: 768px)', true);

	return (
		<DocContainer name={data.name} kind={data.kind} excerpt={data.excerpt} summary={data.summary}>
			<Section title="Members" icon={<VscSymbolEnumMember size={20} />} padded dense={matches}>
				<div className="flex flex-col gap-4">
					{data.members.map((member) => (
						<CodeListing
							key={member.name}
							name={member.name}
							separator={CodeListingSeparatorType.Value}
							typeTokens={member.initializerTokens}
							summary={member.summary}
						/>
					))}
				</div>
			</Section>
		</DocContainer>
	);
}
