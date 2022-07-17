import { CodeListing } from './CodeListing';
import type { DocProperty } from '~/DocModel/DocProperty';

export interface PropertyListProps {
	data: ReturnType<DocProperty['toJSON']>[];
}

export function PropertyList({ data }: PropertyListProps) {
	return (
		<div className="flex flex-col">
			{data.map((prop) => (
				<CodeListing key={prop.name} name={prop.name} typeTokens={prop.propertyTypeTokens} summary={prop.summary} />
			))}
		</div>
	);
}
