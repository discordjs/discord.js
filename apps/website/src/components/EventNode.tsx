import { VscSymbolEvent } from '@react-icons/all-files/vsc/VscSymbolEvent';
import { ChevronDown, ChevronUp, Code2, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { ENV } from '~/util/env';
import { Badges } from './Badges';
import { DeprecatedNode } from './DeprecatedNode';
import { ExampleNode } from './ExampleNode';
import { InheritedFromNode } from './InheritedFromNode';
import { ParameterNode } from './ParameterNode';
import { ReturnNode } from './ReturnNode';
import { SeeNode } from './SeeNode';
import { SummaryNode } from './SummaryNode';
import { TypeParameterNode } from './TypeParameterNode';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/Collapsible';
import { Tab, TabList, TabPanel, Tabs } from './ui/Tabs';

async function EventBodyNode({
	event,
	packageName,
	version,
	overload = false,
}: {
	readonly event: any;
	readonly overload?: boolean;
	readonly packageName: string;
	readonly version: string;
}) {
	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex place-content-between place-items-center">
					<h3
						id={event.displayName}
						className={`${overload ? (ENV.IS_LOCAL_DEV || ENV.IS_PREVIEW ? 'scroll-mt-24' : 'scroll-mt-16') : ENV.IS_LOCAL_DEV || ENV.IS_PREVIEW ? 'scroll-mt-16' : 'scroll-mt-8'} group break-words font-mono font-semibold`}
					>
						<Badges node={event} /> {event.displayName}
						<span>
							<Link href={`#${event.displayName}`} className="float-left -ml-6 hidden pb-2 pr-2 group-hover:block">
								<LinkIcon aria-hidden size={16} />
							</Link>
							{event.typeParameters?.length ? (
								<>
									{'<'}
									<TypeParameterNode node={event.typeParameters} version={version} />
									{'>'}
								</>
							) : null}
							({event.parameters?.length ? <ParameterNode node={event.parameters} version={version} /> : null})
						</span>
					</h3>

					<a
						aria-label="Open source file in new tab"
						className="min-w-min"
						href={event.sourceLine ? `${event.sourceURL}#L${event.sourceLine}` : event.sourceURL}
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

				{event.summary?.deprecatedBlock.length ? (
					<DeprecatedNode deprecatedBlock={event.summary.deprecatedBlock} version={version} />
				) : null}

				{event.summary?.summarySection.length ? (
					<SummaryNode padding node={event.summary.summarySection} version={version} />
				) : null}

				{event.summary?.exampleBlocks.length ? (
					<ExampleNode node={event.summary.exampleBlocks} version={version} />
				) : null}

				{event.summary?.returnsBlock.length ? (
					<ReturnNode padding node={event.summary.returnsBlock} version={version} />
				) : null}

				{event.inheritedFrom ? (
					<InheritedFromNode node={event.inheritedFrom} packageName={packageName} version={version} />
				) : null}

				{event.summary?.seeBlocks.length ? <SeeNode padding node={event.summary.seeBlocks} version={version} /> : null}
			</div>
			<div aria-hidden className="px-4">
				<div role="separator" className="h-[2px] bg-neutral-300 dark:bg-neutral-700" />
			</div>
		</>
	);
}

async function OverloadNode({
	event,
	packageName,
	version,
}: {
	readonly event: any;
	readonly packageName: string;
	readonly version: string;
}) {
	return (
		<Tabs className="flex flex-col gap-4">
			<TabList className="flex gap-2">
				{event.overloads.map((overload: any) => {
					return (
						<Tab
							id={`overload-${overload.displayName}-${overload.overloadIndex}`}
							key={`overload-tab-${overload.displayName}-${overload.overloadIndex}`}
							className="cursor-pointer rounded-full bg-neutral-800/10 px-2 py-1 font-sans text-sm font-normal leading-none text-neutral-800 hover:bg-neutral-800/20 data-[selected]:bg-neutral-500 data-[selected]:text-neutral-100 dark:bg-neutral-200/10 dark:text-neutral-200 dark:hover:bg-neutral-200/20 dark:data-[selected]:bg-neutral-500/70"
						>
							<span>Overload {overload.overloadIndex}</span>
						</Tab>
					);
				})}
			</TabList>
			{event.overloads.map((overload: any) => {
				return (
					<TabPanel
						id={`overload-${overload.displayName}-${overload.overloadIndex}`}
						key={`overload-tab-panel-${overload.displayName}-${overload.overloadIndex}`}
						className="flex flex-col gap-8"
					>
						<EventBodyNode overload event={overload} packageName={packageName} version={version} />
					</TabPanel>
				);
			})}
		</Tabs>
	);
}

export async function EventNode({
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
					<VscSymbolEvent aria-hidden className="flex-shrink-0" size={24} /> Events
				</h2>
				<ChevronDown className='group-data-[state="open"]:hidden' aria-hidden size={24} />
				<ChevronUp className='group-data-[state="closed"]:hidden' aria-hidden size={24} />
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="flex flex-col gap-8">
					{node.map((event: any) => {
						return event.overloads?.length ? (
							<OverloadNode
								key={`${event.displayName}-${event.overloadIndex}`}
								event={event}
								packageName={packageName}
								version={version}
							/>
						) : (
							<EventBodyNode
								key={`${event.displayName}-${event.overloadIndex}`}
								event={event}
								packageName={packageName}
								version={version}
							/>
						);
					})}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
