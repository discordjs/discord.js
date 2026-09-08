import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { ChevronDown, ChevronUp, Code2, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { ENV } from '@/util/env';
import { Badges } from './Badges';
import { DeprecatedNode } from './DeprecatedNode';
import { ExampleNode } from './ExampleNode';
import { ExcerptNode } from './ExcerptNode';
import { InheritedFromNode } from './InheritedFromNode';
import { ParameterNode } from './ParameterNode';
import { ReturnNode } from './ReturnNode';
import { SeeNode } from './SeeNode';
import { SummaryNode } from './SummaryNode';
import { TypeParameterNode } from './TypeParameterNode';
import { UnstableNode } from './UnstableNode';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/Collapsible';
import { Tab, TabList, TabPanel, Tabs } from './ui/Tabs';

async function MethodBodyNode({
	method,
	packageName,
	version,
	overload = false,
}: {
	readonly method: any;
	readonly overload?: boolean;
	readonly packageName: string;
	readonly version: string;
}) {
	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex place-content-between place-items-center gap-1">
					<h3
						className={`${overload ? (ENV.IS_LOCAL_DEV || ENV.IS_PREVIEW ? 'scroll-mt-24' : 'scroll-mt-16') : ENV.IS_LOCAL_DEV || ENV.IS_PREVIEW ? 'scroll-mt-16' : 'scroll-mt-8'} group px-2 font-mono font-semibold break-all`}
						id={method.displayName}
					>
						<Badges node={method} /> {method.displayName}
						<span>
							<Link className="float-left -ml-6 hidden pr-2 pb-2 group-hover:block" href={`#${method.displayName}`}>
								<LinkIcon aria-hidden size={16} />
							</Link>
							{method.typeParameters?.length ? (
								<>
									{'<'}
									<TypeParameterNode node={method.typeParameters} version={version} />
									{'>'}
								</>
							) : null}
							({method.parameters?.length ? <ParameterNode node={method.parameters} version={version} /> : null}
							) : <ExcerptNode node={method.returnTypeExcerpt} version={version} />
						</span>
					</h3>

					<a
						aria-label="Open source file in new tab"
						className="min-w-min"
						href={method.sourceLine ? `${method.sourceURL}#L${method.sourceLine}` : method.sourceURL}
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

				{method.summary?.deprecatedBlock.length ? (
					<DeprecatedNode deprecatedBlock={method.summary.deprecatedBlock} version={version} />
				) : null}

				{method.summary?.unstableBlock?.length ? (
					<UnstableNode unstableBlock={method.summary.unstableBlock} version={version} />
				) : null}

				{method.summary?.summarySection.length ? (
					<SummaryNode node={method.summary.summarySection} padding version={version} />
				) : null}

				{method.summary?.exampleBlocks.length ? (
					<ExampleNode node={method.summary.exampleBlocks} version={version} />
				) : null}

				{method.summary?.returnsBlock.length ? (
					<ReturnNode node={method.summary.returnsBlock} padding version={version} />
				) : null}

				{method.inheritedFrom ? (
					<InheritedFromNode node={method.inheritedFrom} packageName={packageName} version={version} />
				) : null}

				{method.summary?.seeBlocks.length ? (
					<SeeNode node={method.summary.seeBlocks} padding version={version} />
				) : null}
			</div>
			<div aria-hidden className="p-4">
				<div className="h-[2px] bg-neutral-300 dark:bg-neutral-700" role="separator" />
			</div>
		</>
	);
}

async function OverloadNode({
	method,
	packageName,
	version,
}: {
	readonly method: any;
	readonly packageName: string;
	readonly version: string;
}) {
	return (
		<Tabs className="flex flex-col gap-4">
			<TabList className="flex flex-wrap gap-2">
				{method.overloads.map((overload: any) => (
					<Tab
						className="cursor-pointer rounded-full bg-neutral-800/10 px-2 py-1 font-sans text-sm leading-none font-normal whitespace-nowrap text-neutral-800 hover:bg-neutral-800/20 data-[selected]:bg-neutral-500 data-[selected]:text-neutral-100 dark:bg-neutral-200/10 dark:text-neutral-200 dark:hover:bg-neutral-200/20 dark:data-[selected]:bg-neutral-500/70"
						id={`overload-${overload.displayName}-${overload.overloadIndex}`}
						key={`overload-tab-${overload.displayName}-${overload.overloadIndex}`}
					>
						<span>Overload {overload.overloadIndex}</span>
					</Tab>
				))}
			</TabList>
			{method.overloads.map((overload: any) => (
				<TabPanel
					className="flex flex-col gap-4"
					id={`overload-${overload.displayName}-${overload.overloadIndex}`}
					key={`overload-tab-panel-${overload.displayName}-${overload.overloadIndex}`}
				>
					<MethodBodyNode method={overload} overload packageName={packageName} version={version} />
				</TabPanel>
			))}
		</Tabs>
	);
}

export async function MethodNode({
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
					<VscSymbolMethod aria-hidden className="flex-shrink-0" size={24} /> Methods
				</h2>
				<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
				<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="flex flex-col gap-4">
					{node.map((method: any) =>
						method.overloads?.length ? (
							<OverloadNode
								key={`${method.displayName}-${method.overloadIndex}`}
								method={method}
								packageName={packageName}
								version={version}
							/>
						) : (
							<MethodBodyNode
								key={`${method.displayName}-${method.overloadIndex}`}
								method={method}
								packageName={packageName}
								version={version}
							/>
						),
					)}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
