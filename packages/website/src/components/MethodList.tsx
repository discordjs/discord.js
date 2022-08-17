import { Divider, Stack } from '@mantine/core';
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
				<>
					<MethodItem key={method.name} data={method} />
					<Divider className="bg-gray-100" size="md" />
				</>
			))}
		</Stack>
	);
}
