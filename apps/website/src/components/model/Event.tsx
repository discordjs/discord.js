import type { ApiDeclaredItem, ApiItemContainerMixin, ApiEvent } from '@discordjs/api-extractor-model';
import { Badges } from '../Badges';
import { CodeHeading } from '../CodeHeading';
import { InheritanceText } from '../InheritanceText';
import { ParameterTable } from '../ParameterTable';
import { TSDoc } from '../documentation/tsdoc/TSDoc';

export function Event({
	item,
	inheritedFrom,
}: {
	readonly inheritedFrom?: (ApiDeclaredItem & ApiItemContainerMixin) | undefined;
	readonly item: ApiEvent;
}) {
	const hasSummary = Boolean(item.tsdocComment?.summarySection);

	return (
		<div className="flex flex-col scroll-mt-30 gap-4" id={item.displayName}>
			<div className="flex flex-col gap-2 md:-ml-9">
				<Badges item={item} />
				<CodeHeading
					href={`#${item.displayName}`}
					sourceURL={item.sourceLocation.fileUrl}
					sourceLine={item.sourceLocation.fileLine}
				>
					{item.name}
				</CodeHeading>
			</div>
			{hasSummary || inheritedFrom ? (
				<div className="mb-4 w-full flex flex-col gap-4">
					{item.tsdocComment ? <TSDoc item={item} tsdoc={item.tsdocComment} /> : null}
					{item.parameters.length ? <ParameterTable item={item} /> : null}
					{inheritedFrom ? <InheritanceText parent={inheritedFrom} /> : null}
				</div>
			) : null}
		</div>
	);
}
