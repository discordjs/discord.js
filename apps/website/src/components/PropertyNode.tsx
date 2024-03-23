import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
import { ChevronDown, ChevronUp, Code2, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { ENV } from '~/util/env';
import { Badges } from './Badges';
import { DeprecatedNode } from './DeprecatedNode';
import { ExcerptNode } from './ExcerptNode';
import { InheritedFromNode } from './InheritedFromNode';
import { SeeNode } from './SeeNode';
import { SummaryNode } from './SummaryNode';
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
		<Collapsible className="flex flex-col gap-8" defaultOpen>
			<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
				<h2 className="flex place-items-center gap-2 text-xl font-bold">
					<VscSymbolProperty aria-hidden className="flex-shrink-0" size={24} />
					Properties
				</h2>
				<ChevronDown className='group-data-[state="open"]:hidden' aria-hidden size={24} />
				<ChevronUp className='group-data-[state="closed"]:hidden' aria-hidden size={24} />
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="flex flex-col gap-8">
					{node.map((property: any, idx: number) => {
						return (
							<Fragment key={`${property.displayName}-${idx}`}>
								<div className="flex flex-col gap-4">
									<div className="flex place-content-between place-items-center">
										<h3
											id={property.displayName}
											className={`${ENV.IS_LOCAL_DEV || ENV.IS_PREVIEW ? 'scroll-mt-16' : 'scroll-mt-8'} group flex flex-col gap-2 break-words font-mono font-semibold`}
										>
											<Badges node={property} />
											<span>
												<Link
													href={`#${property.displayName}`}
													className="float-left -ml-6 hidden pb-2 pr-2 group-hover:block"
												>
													<LinkIcon aria-hidden size={16} />
												</Link>
												{property.displayName}
												{property.isOptional ? '?' : ''} : <ExcerptNode node={property.typeExcerpt} version={version} />
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
												size={20}
												className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300"
											/>
										</a>
									</div>

									{property.summary?.deprecatedBlock.length ? (
										<DeprecatedNode deprecatedBlock={property.summary.deprecatedBlock} version={version} />
									) : null}

									{property.summary?.summarySection.length ? (
										<SummaryNode padding node={property.summary.summarySection} version={version} />
									) : null}

									{property.inheritedFrom ? (
										<InheritedFromNode node={property.inheritedFrom} packageName={packageName} version={version} />
									) : null}

									{property.summary?.seeBlocks.length ? (
										<SeeNode padding node={property.summary.seeBlocks} version={version} />
									) : null}
								</div>
								<div aria-hidden className="px-4">
									<div role="separator" className="h-[2px] bg-neutral-300 dark:bg-neutral-700" />
								</div>
							</Fragment>
						);
					})}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
