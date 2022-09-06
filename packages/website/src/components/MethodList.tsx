import type { ApiMethodJSON, ApiMethodSignatureJSON } from '@discordjs/api-extractor-utils';
import { useMemo } from 'react';
import { MethodItem } from './MethodItem';

export function MethodList({ data }: { data: (ApiMethodJSON | ApiMethodSignatureJSON)[] }) {
	const methodItems = useMemo(
		() =>
			data.map((method) => (
				<div
					key={`${method.name}${method.overloadIndex && method.overloadIndex > 1 ? `:${method.overloadIndex}` : ''}`}
				>
					<MethodItem data={method} />
					<div className="border-light-900 -mx-10 border-t-2" />
				</div>
			)),
		[data],
	);

	return <div className="flex flex-col gap-4">{methodItems}</div>;
}
