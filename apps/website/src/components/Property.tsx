import type {
	ApiDeclaredItem,
	ApiItemContainerMixin,
	ApiProperty,
	ApiPropertySignature,
} from '@microsoft/api-extractor-model';
import type { PropsWithChildren } from 'react';
import { Anchor } from './Anchor';
import { ExcerptText } from './ExcerptText';
import { InheritanceText } from './InheritanceText';
import { TSDoc } from './documentation/tsdoc/TSDoc';

export enum PropertySeparatorType {
	Type = ':',
	Value = '=',
}

export function Property({
	item,
	children,
	separator,
	inheritedFrom,
}: PropsWithChildren<{
	inheritedFrom?: (ApiDeclaredItem & ApiItemContainerMixin) | undefined;
	item: ApiProperty | ApiPropertySignature;
	separator?: PropertySeparatorType;
}>) {
	const isDeprecated = Boolean(item.tsdocComment?.deprecatedBlock);
	const hasSummary = Boolean(item.tsdocComment?.summarySection);

	return (
		<div className="flex flex-col scroll-mt-30 gap-4" id={item.displayName}>
			<div className="flex flex-col gap-2 md:-ml-9">
				{isDeprecated || item.isReadonly || item.isOptional || (item as ApiProperty).isStatic ? (
					<div className="flex flex-row gap-1 md:ml-7">
						{isDeprecated ? (
							<div className="h-5 flex flex-row place-content-center place-items-center rounded-full bg-red-500 px-3 text-center text-xs font-semibold uppercase text-white">
								Deprecated
							</div>
						) : null}
						{(item as ApiProperty).isStatic ? (
							<div className="h-5 flex flex-row place-content-center place-items-center rounded-full bg-blurple px-3 text-center text-xs font-semibold uppercase text-white">
								Static
							</div>
						) : null}
						{item.isReadonly ? (
							<div className="h-5 flex flex-row place-content-center place-items-center rounded-full bg-blurple px-3 text-center text-xs font-semibold uppercase text-white">
								Readonly
							</div>
						) : null}
						{item.isOptional ? (
							<div className="h-5 flex flex-row place-content-center place-items-center rounded-full bg-blurple px-3 text-center text-xs font-semibold uppercase text-white">
								Optional
							</div>
						) : null}
					</div>
				) : null}
				<div className="group flex flex-row flex-wrap place-items-center gap-1">
					<Anchor href={`#${item.displayName}`} />
					<h4 className="break-all font-mono text-lg font-bold">
						{item.displayName}
						{item.isOptional ? '?' : ''}
					</h4>
					{item.propertyTypeExcerpt.text ? (
						<>
							<h4 className="font-mono text-lg font-bold">{separator}</h4>
							<h4 className="break-all font-mono text-lg font-bold">
								<ExcerptText excerpt={item.propertyTypeExcerpt} model={item.getAssociatedModel()!} />
							</h4>
						</>
					) : null}
				</div>
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
