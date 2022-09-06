import type { ApiPropertyItemJSON } from '@discordjs/api-extractor-utils';
import { Fragment, useMemo } from 'react';
import { CodeListing } from './CodeListing';

export function PropertyList({ data }: { data: ApiPropertyItemJSON[] }) {
	const propertyItems = useMemo(
		() =>
			data.map((prop) => (
				<Fragment key={prop.name}>
					<CodeListing
						name={prop.name}
						typeTokens={prop.propertyTypeTokens}
						readonly={prop.readonly}
						optional={prop.optional}
						summary={prop.summary}
						comment={prop.comment}
						deprecation={prop.deprecated}
						inheritanceData={prop.inheritanceData}
					/>
					<div className="border-light-900 -mx-8 border-t-2" />
				</Fragment>
			)),
		[data],
	);

	return <div className="flex flex-col gap-4">{propertyItems}</div>;
}
