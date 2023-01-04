import { generatePath } from '@discordjs/api-extractor-utils';
import type { ApiPropertyItem } from '@microsoft/api-extractor-model';
import type { PropsWithChildren } from 'react';
import { Anchor } from './Anchor';
import { HyperlinkedText } from './HyperlinkedText';
import { InheritanceText } from './InheritanceText';
import { TSDoc } from './documentation/tsdoc/TSDoc';
import { tokenize } from './documentation/util';

export enum PropertySeparatorType {
	Type = ':',
	Value = '=',
}

export function Property({
	item,
	children,
	separator,
	parentKey,
	version,
}: PropsWithChildren<{
	item: ApiPropertyItem;
	parentKey: string;
	separator?: PropertySeparatorType;
	version: string;
}>) {
	const isDeprecated = Boolean(item.tsdocComment?.deprecatedBlock);
	const hasSummary = Boolean(item.tsdocComment?.summarySection);
	const isInherited = item.parent?.containerKey !== parentKey;

	return (
		<div className="scroll-mt-30 flex flex-col gap-4" id={item.displayName}>
			<div className="md:-ml-8.5 flex flex-col gap-2 md:flex-row md:place-items-center">
				<Anchor href={`#${item.displayName}`} />
				{isDeprecated || item.isReadonly || item.isOptional ? (
					<div className="flex flex-row gap-1">
						{isDeprecated ? (
							<div className="flex h-5 flex-row place-content-center place-items-center rounded-full bg-red-500 px-3 text-center text-xs font-semibold uppercase text-white">
								Deprecated
							</div>
						) : null}
						{item.isReadonly ? (
							<div className="bg-blurple flex h-5 flex-row place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
								Readonly
							</div>
						) : null}
						{item.isOptional ? (
							<div className="bg-blurple flex h-5 flex-row place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
								Optional
							</div>
						) : null}
					</div>
				) : null}
				<div className="flex flex-row flex-wrap place-items-center gap-1">
					<h4 className="break-all font-mono text-lg font-bold">
						{item.displayName}
						{item.isOptional ? '?' : ''}
					</h4>
					<h4 className="font-mono text-lg font-bold">{separator}</h4>
					<h4 className="break-all font-mono text-lg font-bold">
						<HyperlinkedText
							tokens={tokenize(item.getAssociatedModel()!, item.propertyTypeExcerpt.spannedTokens, version)}
						/>
					</h4>
				</div>
			</div>
			{hasSummary || isInherited ? (
				<div className="mb-4 flex flex-col gap-4">
					{item.tsdocComment ? <TSDoc item={item} tsdoc={item.tsdocComment} version={version} /> : null}
					{isInherited ? (
						<InheritanceText
							parentKey={item.parent!.containerKey}
							parentName={item.parent!.displayName}
							path={generatePath(item.getHierarchy(), version)}
						/>
					) : null}
					{children}
				</div>
			) : null}
		</div>
	);
}
