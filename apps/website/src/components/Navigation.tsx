'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Loader2Icon } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { parseDocsPathParams } from '@/util/parseDocsPathParams';
import { resolveNodeKind } from './DocKind';
import { NavigationItem } from './NavigationItem';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/Collapsible';

export function Navigation() {
	const params = useParams<{
		item?: string[] | undefined;
		packageName: string;
		version: string;
	}>();

	const { entryPoints: parsedEntrypoints } = parseDocsPathParams(params.item);

	const {
		data: node,
		status,
		isLoading,
	} = useQuery({
		queryKey: ['sitemap', params.packageName, params.version, parsedEntrypoints.join('.')],
		queryFn: async () => {
			const response = await fetch(
				`/api/docs/sitemap?packageName=${params.packageName}&version=${params.version}&entryPoint=${parsedEntrypoints.join('.')}`,
			);

			return response.json();
		},
	});

	if ((status === 'success' && !node) || status === 'error') {
		notFound();
	}

	const groupedNodes = node?.reduce((acc: any, node: any) => {
		(acc[node.kind.toLowerCase()] ||= []).push(node);
		return acc;
	}, {});

	if (isLoading) {
		return <Loader2Icon className="mx-auto h-10 w-10 animate-spin" />;
	}

	return (
		<nav className="flex flex-col gap-2 pr-3">
			{groupedNodes?.class?.length ? (
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
									<NavigationItem
										key={`${node.name}-${idx}`}
										node={node}
										packageName={params.packageName}
										version={params.version}
									>
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

			{groupedNodes?.function?.length ? (
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
									<NavigationItem
										key={`${node.name}-${idx}`}
										node={node}
										packageName={params.packageName}
										version={params.version}
									>
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

			{groupedNodes?.enum?.length ? (
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
									<NavigationItem
										key={`${node.name}-${idx}`}
										node={node}
										packageName={params.packageName}
										version={params.version}
									>
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

			{groupedNodes?.interface?.length ? (
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
									<NavigationItem
										key={`${node.name}-${idx}`}
										node={node}
										packageName={params.packageName}
										version={params.version}
									>
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

			{groupedNodes?.typealias?.length ? (
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
									<NavigationItem
										key={`${node.name}-${idx}`}
										node={node}
										packageName={params.packageName}
										version={params.version}
									>
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

			{groupedNodes?.variable?.length ? (
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
									<NavigationItem
										key={`${node.name}-${idx}`}
										node={node}
										packageName={params.packageName}
										version={params.version}
									>
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
