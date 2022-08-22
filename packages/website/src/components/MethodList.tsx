import { Divider, Stack } from '@mantine/core';
import { Fragment } from 'react';
import { MethodItem } from './MethodItem';
import type { ApiMethodJSON, ApiMethodSignatureJSON } from '~/DocModel/ApiNodeJSONEncoder';

export function MethodList({ data }: { data: (ApiMethodJSON | ApiMethodSignatureJSON)[] }) {
	return (
		<Stack>
			{data.map((method) => (
				<Fragment
					key={`${method.name}${method.overloadIndex && method.overloadIndex > 1 ? `:${method.overloadIndex}` : ''}`}
				>
					<MethodItem data={method} />
					<Divider className="bg-gray-100" size="md" />
				</Fragment>
			))}
		</Stack>
	);
}
