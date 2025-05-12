import { ChevronDown, ChevronUp } from 'lucide-react';
import { notFound } from 'next/navigation';
import { fetchSitemap } from '@/util/fetchSitemap';
import { resolveNodeKind } from './DocKind';
import { NavigationItem } from './NavigationItem';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/Collapsible';

export async function Navigation({
	entryPoint,
	packageName,
	version,
}: {
	readonly entryPoint?: string | undefined;
	readonly packageName: string;
	readonly version: string;
}) {
	const node = await fetchSitemap({ entryPoint, packageName, version });

	if (!node) {
		notFound();
	}

	const groupedNodes = node.reduce((acc: any, node: any) => {
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		(acc[node.kind.toLowerCase()] ||= []).push(node);
		return acc;
	}, {});

	return (
		<nav className="flex flex-col gap-2 pr-3">
			{groupedNodes.class?.length ? (
				<Collapsible className="flex flex-col gap-2" defaultOpen>
					<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-[#e7e7e9] dark:hover:bg-[#242428]">
						<h4 className="font-semibold">Classes</h4>
						<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
						<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="flex flex-col">
							{groupedNodes.class.map((node: any, idx: number) => {
								const kind = resolveNodeKind(node.kind);
								return (
									<NavigationItem key={`${node.name}-${idx}`} node={node} packageName={packageName} version={version}>
										<div className={`inline-block h-6 w-6 rounded-full text-center ${kind.background} ${kind.text}`}>
											{node.kind[0]}
										</div>{' '}
										<span className="font-sans">{node.name}</span>
									</NavigationItem>
								);
							})}
						</div>
					</CollapsibleContent>
				</Collapsible>
			) : null}

			{groupedNodes.function?.length ? (
				<Collapsible className="flex flex-col gap-2" defaultOpen>
					<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-[#e7e7e9] dark:hover:bg-[#242428]">
						<h4 className="font-semibold">Functions</h4>
						<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
						<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="flex flex-col">
							{groupedNodes.function.map((node: any, idx: number) => {
								const kind = resolveNodeKind(node.kind);
								return (
									<NavigationItem key={`${node.name}-${idx}`} node={node} packageName={packageName} version={version}>
										<div className={`inline-block h-6 w-6 rounded-full text-center ${kind.background} ${kind.text}`}>
											{node.kind[0]}
										</div>{' '}
										<span className="font-sans">{node.name}</span>
									</NavigationItem>
								);
							})}
						</div>
					</CollapsibleContent>
				</Collapsible>
			) : null}

			{groupedNodes.enum?.length ? (
				<Collapsible className="flex flex-col gap-2" defaultOpen>
					<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-[#e7e7e9] dark:hover:bg-[#242428]">
						<h4 className="font-semibold">Enums</h4>
						<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
						<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="flex flex-col">
							{groupedNodes.enum.map((node: any, idx: number) => {
								const kind = resolveNodeKind(node.kind);
								return (
									<NavigationItem key={`${node.name}-${idx}`} node={node} packageName={packageName} version={version}>
										<div className={`inline-block h-6 w-6 rounded-full text-center ${kind.background} ${kind.text}`}>
											{node.kind[0]}
										</div>{' '}
										<span className="font-sans">{node.name}</span>
									</NavigationItem>
								);
							})}
						</div>
					</CollapsibleContent>
				</Collapsible>
			) : null}

			{groupedNodes.interface?.length ? (
				<Collapsible className="flex flex-col gap-2" defaultOpen>
					<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-[#e7e7e9] dark:hover:bg-[#242428]">
						<h4 className="font-semibold">Interfaces</h4>
						<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
						<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="flex flex-col">
							{groupedNodes.interface.map((node: any, idx: number) => {
								const kind = resolveNodeKind(node.kind);
								return (
									<NavigationItem key={`${node.name}-${idx}`} node={node} packageName={packageName} version={version}>
										<div className={`inline-block h-6 w-6 rounded-full text-center ${kind.background} ${kind.text}`}>
											{node.kind[0]}
										</div>{' '}
										<span className="font-sans">{node.name}</span>
									</NavigationItem>
								);
							})}
						</div>
					</CollapsibleContent>
				</Collapsible>
			) : null}

			{groupedNodes.typealias?.length ? (
				<Collapsible className="flex flex-col gap-2" defaultOpen>
					<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-[#e7e7e9] dark:hover:bg-[#242428]">
						<h4 className="font-semibold">Types</h4>
						<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
						<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="flex flex-col">
							{groupedNodes.typealias.map((node: any, idx: number) => {
								const kind = resolveNodeKind(node.kind);
								return (
									<NavigationItem key={`${node.name}-${idx}`} node={node} packageName={packageName} version={version}>
										<div className={`inline-block h-6 w-6 rounded-full text-center ${kind.background} ${kind.text}`}>
											{node.kind[0]}
										</div>{' '}
										<span className="font-sans">{node.name}</span>
									</NavigationItem>
								);
							})}
						</div>
					</CollapsibleContent>
				</Collapsible>
			) : null}

			{groupedNodes.variable?.length ? (
				<Collapsible className="flex flex-col gap-2" defaultOpen>
					<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-[#e7e7e9] dark:hover:bg-[#242428]">
						<h4 className="font-semibold">Variables</h4>
						<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
						<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="flex flex-col">
							{groupedNodes.variable.map((node: any, idx: number) => {
								const kind = resolveNodeKind(node.kind);
								return (
									<NavigationItem key={`${node.name}-${idx}`} node={node} packageName={packageName} version={version}>
										<div className={`inline-block h-6 w-6 rounded-full text-center ${kind.background} ${kind.text}`}>
											{node.kind[0]}
										</div>{' '}
										<span className="font-sans">{node.name}</span>
									</NavigationItem>
								);
							})}
						</div>
					</CollapsibleContent>
				</Collapsible>
			) : null}
		</nav>
	);
}
