import type { DocMethod } from '~/DocModel/DocMethod';
import type { DocMethodSignature } from '~/DocModel/DocMethodSignature';

export interface MethodListProps {
	data: (ReturnType<DocMethod['toJSON']> | ReturnType<DocMethodSignature['toJSON']>)[];
}

export function MethodList({ data }: MethodListProps) {
	return (
		<div>
			<h3>Methods</h3>
			<ul>
				{data.map((method) => (
					<li key={method.name}>{method.name}</li>
				))}
			</ul>
		</div>
	);
}
