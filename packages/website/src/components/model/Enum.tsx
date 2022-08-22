import { Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { VscSymbolEnumMember } from 'react-icons/vsc';
import { CodeListing, CodeListingSeparatorType } from '../CodeListing';
import { DocContainer } from '../DocContainer';
import { Section } from '../Section';
import type { ApiEnumJSON } from '~/DocModel/ApiNodeJSONEncoder';

export function Enum({ data }: { data: ApiEnumJSON }) {
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	return (
		<DocContainer name={data.name} kind={data.kind} excerpt={data.excerpt} summary={data.summary}>
			<Section title="Members" icon={<VscSymbolEnumMember />} padded dense={matches}>
				<Stack>
					{data.members.map((member) => (
						<CodeListing
							key={member.name}
							name={member.name}
							separator={CodeListingSeparatorType.Value}
							typeTokens={member.initializerTokens}
							summary={member.summary}
						/>
					))}
				</Stack>
			</Section>
		</DocContainer>
	);
}
