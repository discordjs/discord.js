import { MethodItem } from './MethodItem';
import type { DocMethod } from '~/DocModel/DocMethod';
import type { DocMethodSignature } from '~/DocModel/DocMethodSignature';

export interface MethodListProps {
	data: (ReturnType<DocMethod['toJSON']> | ReturnType<DocMethodSignature['toJSON']>)[];
}

export function MethodList({ data }: MethodListProps) {
	return (
		<div>
			<div className="flex flex-col">
				{data.map((method) => (
					<MethodItem key={method.name} data={method} />
				))}
			</div>
		</div>
	);
}
