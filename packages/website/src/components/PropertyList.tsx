import { Stack } from '@mantine/core';
import { CodeListing } from './CodeListing';
import type { DocProperty } from '~/DocModel/DocProperty';

export function PropertyList({ data }: { data: ReturnType<DocProperty['toJSON']>[] }) {
	return (
		<Stack>
			{data.map((prop) => (
				<CodeListing
					key={prop.name}
					name={prop.name}
					typeTokens={prop.propertyTypeTokens}
					readonly={prop.readonly}
					optional={prop.optional}
					summary={prop.summary}
					comment={prop.comment}
					deprecation={prop.deprecated}
					inheritanceData={prop.inheritanceData}
				/>
			))}
		</Stack>
	);
}
