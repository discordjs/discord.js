'use server';

import type { ApiEnumJSON } from '@discordjs/api-extractor-utils';
import { Section } from '@discordjs/ui';
import { VscSymbolEnumMember } from '@react-icons/all-files/vsc/VscSymbolEnumMember';
import { Fragment } from 'react';
import { useMedia } from 'react-use';
import { CodeListing, CodeListingSeparatorType } from '../CodeListing';
import { DocContainer } from '../DocContainer';

export function Enum({ data }: { data: ApiEnumJSON }) {
	const matches = useMedia('(max-width: 768px)', true);

	return (
		<DocContainer excerpt={data.excerpt} kind={data.kind} name={data.name} summary={data.summary}>
			<Section dense={matches} icon={<VscSymbolEnumMember size={20} />} padded title="Members">
				<div className="flex flex-col gap-4">
					{data.members.map((member) => (
						<Fragment key={member.name}>
							<CodeListing
								name={member.name}
								separator={CodeListingSeparatorType.Value}
								summary={member.summary}
								typeTokens={member.initializerTokens}
							/>
							<div className="border-light-900 dark:border-dark-100 -mx-8 border-t-2" />
						</Fragment>
					))}
				</div>
			</Section>
		</DocContainer>
	);
}
