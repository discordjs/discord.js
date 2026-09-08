import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
import { ChevronDown, ChevronUp, Code2, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { ENV } from '@/util/env';
import { Badges } from './Badges';
import { DeprecatedNode } from './DeprecatedNode';
import { ExcerptNode } from './ExcerptNode';
import { InheritedFromNode } from './InheritedFromNode';
import { SeeNode } from './SeeNode';
import { SummaryNode } from './SummaryNode';
import { UnstableNode } from './UnstableNode';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/Collapsible';

export async function PropertyNode({
	node,
	packageName,
	version,
}: {
	readonly node: any;
	readonly packageName: string;
	readonly version: string;
}) {
	return (
		<Collapsible className="flex flex-col gap-4" defaultOpen>
			<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-[#e7e7e9] dark:hover:bg-[#242428]">
				<h2 className="flex place-items-center gap-2 text-xl font-bold">
					<VscSymbolProperty aria-hidden className="flex-shrink-0" size={24} />
					Properties
				</h2>
				<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
				<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="flex flex-col gap-4">
					{node.map((property: any, idx: number) => (
						<Fragment key={`${property.displayName}-${idx}`}>
							<div className="flex flex-col gap-4">
								<div className="flex place-content-between place-items-center gap-1">
									<h3
										className={`${ENV.IS_LOCAL_DEV || ENV.IS_PREVIEW ? 'scroll-mt-16' : 'scroll-mt-8'} group flex flex-col gap-2 px-2 font-mono font-semibold break-all`}
										id={property.displayName}
									>
										<Badges node={property} />
										<span>
											<Link
												className="float-left -ml-6 hidden pr-2 pb-2 group-hover:block"
												href={`#${property.displayName}`}
											>
												<LinkIcon aria-hidden size={16} />
											</Link>
											{property.displayName}
											{property.isOptional ? '?' : ''} : <ExcerptNode node={property.typeExcerpt} version={version} />{' '}
											{property.summary?.defaultValueBlock.length
												? `= ${property.summary.defaultValueBlock.reduce(
														(acc: string, def: { kind: string; text: string }) => `${acc}${def.text}`,
														'',
													)}`
												: ''}
										</span>
									</h3>

									<a
										aria-label="Open source file in new tab"
										className="min-w-min"
										href={property.sourceLine ? `${property.sourceURL}#L${property.sourceLine}` : property.sourceURL}
										rel="external noreferrer noopener"
										target="_blank"
									>
										<Code2
											aria-hidden
											className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300"
											size={20}
										/>
									</a>
								</div>

								{property.summary?.deprecatedBlock.length ? (
									<DeprecatedNode deprecatedBlock={property.summary.deprecatedBlock} version={version} />
								) : null}

								{property.summary?.unstableBlock?.length ? (
									<UnstableNode unstableBlock={property.summary.unstableBlock} version={version} />
								) : null}

								{property.summary?.summarySection.length ? (
									<SummaryNode node={property.summary.summarySection} padding version={version} />
								) : null}

								{property.inheritedFrom ? (
									<InheritedFromNode node={property.inheritedFrom} packageName={packageName} version={version} />
								) : null}

								{property.summary?.seeBlocks.length ? (
									<SeeNode node={property.summary.seeBlocks} padding version={version} />
								) : null}
							</div>
							<div aria-hidden className="p-4">
								<div className="h-[2px] bg-neutral-300 dark:bg-neutral-700" role="separator" />
							</div>
						</Fragment>
					))}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
