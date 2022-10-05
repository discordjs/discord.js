import type { ApiPropertyItemJSON } from '@discordjs/api-extractor-utils';
import { Fragment, useMemo } from 'react';
import { CodeListing } from './CodeListing';

export function PropertyList({ data }: { data: ApiPropertyItemJSON[] }) {
	const propertyItems = useMemo(
		() =>
			data.map((prop) => (
				<Fragment key={prop.name}>
					<CodeListing
						comment={prop.comment}
						deprecation={prop.deprecated}
						inheritanceData={prop.inheritanceData}
						name={prop.name}
						optional={prop.optional}
						readonly={prop.readonly}
						summary={prop.summary}
						typeTokens={prop.propertyTypeTokens}
					/>
					<div className="border-light-900 dark:border-dark-100 -mx-8 border-t-2" />
				</Fragment>
			)),
		[data],
	);

	return <div className="flex flex-col gap-4">{propertyItems}</div>;
}
