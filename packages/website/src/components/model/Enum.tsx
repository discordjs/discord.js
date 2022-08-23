import { Skeleton, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { VscSymbolEnumMember } from 'react-icons/vsc';
import { CodeListing, CodeListingSeparatorType } from '../CodeListing';
import { DocContainer } from '../DocContainer';
import { Section } from '../Section';
import type { ApiEnumJSON } from '~/DocModel/ApiNodeJSONEncoder';

export function Enum({ data }: { data: ApiEnumJSON }) {
	const router = useRouter();
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	return (
		<DocContainer name={data.name} kind={data.kind} excerpt={data.excerpt} summary={data.summary}>
			<Skeleton visible={router.isFallback} radius="xs">
				<Section title="Members" icon={<VscSymbolEnumMember size={20} />} padded dense={matches}>
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
			</Skeleton>
		</DocContainer>
	);
}
