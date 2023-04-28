import type {
	ApiDeclaredItem,
	ApiItemContainerMixin,
	ApiProperty,
	ApiPropertySignature,
} from '@microsoft/api-extractor-model';
import type { PropsWithChildren } from 'react';
import { Badges } from './Badges';
import { CodeHeading } from './CodeHeading';
import { ExcerptText } from './ExcerptText';
import { InheritanceText } from './InheritanceText';
import { TSDoc } from './documentation/tsdoc/TSDoc';

export function Property({
	item,
	children,
	inheritedFrom,
}: PropsWithChildren<{
	inheritedFrom?: (ApiDeclaredItem & ApiItemContainerMixin) | undefined;
	item: ApiProperty | ApiPropertySignature;
}>) {
	const hasSummary = Boolean(item.tsdocComment?.summarySection);

	return (
		<div className="flex flex-col scroll-mt-30 gap-4" id={item.displayName}>
			<div className="flex flex-col gap-2 md:-ml-9">
				<Badges item={item} />
				<CodeHeading href={`#${item.displayName}`}>
					{`${item.displayName}${item.isOptional ? '?' : ''}`}
					<span>:</span>
					{item.propertyTypeExcerpt.text ? (
						<ExcerptText excerpt={item.propertyTypeExcerpt} model={item.getAssociatedModel()!} />
					) : null}
				</CodeHeading>
			</div>
			{hasSummary || inheritedFrom ? (
				<div className="mb-4 flex flex-col gap-4">
					{item.tsdocComment ? <TSDoc item={item} tsdoc={item.tsdocComment} /> : null}
					{inheritedFrom ? <InheritanceText parent={inheritedFrom} /> : null}
					{children}
				</div>
			) : null}
		</div>
	);
}
