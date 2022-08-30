import type { ApiPropertyItemJSON } from '@discordjs/api-extractor-utils';
import { Divider, Stack } from '@mantine/core';
import { Fragment } from 'react';
import { CodeListing } from './CodeListing';

export function PropertyList({ data }: { data: ApiPropertyItemJSON[] }) {
	return (
		<Stack>
			{data.map((prop) => (
				<Fragment key={prop.name}>
					<CodeListing
						name={prop.name}
						typeTokens={prop.propertyTypeTokens}
						readonly={prop.readonly}
						optional={prop.optional}
						summary={prop.summary}
						comment={prop.comment}
						deprecation={prop.deprecated}
						inheritanceData={prop.inheritanceData}
					/>
					<Divider size="md" />
				</Fragment>
			))}
		</Stack>
	);
}
