import { PropertyItem } from './PropertyItem';
import type { DocProperty } from '~/DocModel/DocProperty';

export interface PropertyListProps {
	data: ReturnType<DocProperty['toJSON']>[];
}

export function PropertyList({ data }: PropertyListProps) {
	return (
		<div className="flex flex-col">
			<h2>Properties</h2>
			{data.map((prop) => (
				<PropertyItem key={prop.name} data={prop} />
			))}
		</div>
	);
}
