import { Divider, Stack } from '@mantine/core';
import { Fragment } from 'react';
import { MethodItem } from './MethodItem';
import type { DocMethod } from '~/DocModel/DocMethod';
import type { DocMethodSignature } from '~/DocModel/DocMethodSignature';

export function MethodList({
	data,
}: {
	data: (ReturnType<DocMethod['toJSON']> | ReturnType<DocMethodSignature['toJSON']>)[];
}) {
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
