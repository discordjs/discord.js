import { Stack } from '@mantine/core';
import { CodeListing } from './CodeListing';
import type { DocProperty } from '~/DocModel/DocProperty';

export function PropertyList({ data }: { data: ReturnType<DocProperty['toJSON']>[] }) {
	return (
		<Stack>
			{data.map((prop) => (
				<CodeListing key={prop.name} prop={prop} />
			))}
		</Stack>
	);
}
