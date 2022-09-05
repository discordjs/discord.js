import type { ApiMethodJSON, ApiMethodSignatureJSON } from '@discordjs/api-extractor-utils';
import { Divider } from '@mantine/core';
import { MethodItem } from './MethodItem';

export function MethodList({ data }: { data: (ApiMethodJSON | ApiMethodSignatureJSON)[] }) {
	return (
		<div className="flex flex-col gap-4">
			{data.map((method) => (
				<div
					key={`${method.name}${method.overloadIndex && method.overloadIndex > 1 ? `:${method.overloadIndex}` : ''}`}
				>
					<MethodItem data={method} />
					<Divider size="md" />
				</div>
			))}
		</div>
	);
}
