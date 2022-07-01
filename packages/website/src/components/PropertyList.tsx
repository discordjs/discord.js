import type { DocProperty } from '~/DocModel/DocProperty';

export interface PropertyListProps {
	data: ReturnType<DocProperty['toJSON']>[];
}

export function PropertyList({ data }: PropertyListProps) {
	return (
		<div>
			<h3>Properties</h3>
			<ul>
				{data.map((prop) => (
					<li key={prop.name}>{prop.name}</li>
				))}
			</ul>
		</div>
	);
}
