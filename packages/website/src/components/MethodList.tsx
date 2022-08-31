import type { ApiMethodJSON, ApiMethodSignatureJSON } from '@discordjs/api-extractor-utils';
import { Divider, Stack } from '@mantine/core';
import { Fragment } from 'react';
import { MethodItem } from './MethodItem.jsx';

export function MethodList({ data }: { data: (ApiMethodJSON | ApiMethodSignatureJSON)[] }) {
	return (
		<Stack>
			{data.map((method) => (
				<Fragment
					key={`${method.name}${method.overloadIndex && method.overloadIndex > 1 ? `:${method.overloadIndex}` : ''}`}
				>
					<MethodItem data={method} />
					<Divider size="md" />
				</Fragment>
			))}
		</Stack>
	);
}
