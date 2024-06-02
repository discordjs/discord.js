import { VscGithubInverted } from '@react-icons/all-files/vsc/VscGithubInverted';
import { ChevronDown, ChevronUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchSitemap } from '~/util/fetchSitemap';
import { fetchVersions } from '~/util/fetchVersions';
import { resolveNodeKind } from './DocKind';
import { NavigationItem } from './NavigationItem';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/Collapsible';
import { PackageSelect } from './ui/PackageSelect';
import { SearchButton } from './ui/SearchButton';
import { VersionSelect } from './ui/VersionSelect';

// eslint-disable-next-line promise/prefer-await-to-then
const ThemeSwitch = dynamic(async () => import('~/components/ui/ThemeSwitch').then((mod) => mod.ThemeSwitch), {
	ssr: false,
});

export async function Navigation({
	className = '',
	packageName,
	version,
	drawer = false,
}: {
	readonly className?: string;
	readonly drawer?: boolean;
	readonly packageName: string;
	readonly version: string;
}) {
	const node = await fetchSitemap({ packageName, version });

	if (!node) {
		notFound();
	}

	const versions = await fetchVersions(packageName);

	const groupedNodes = node.reduce((acc: any, node: any) => {
		(acc[node.kind.toLowerCase()] ||= []).push(node);
		return acc;
	}, {});

	return (
		<aside className={`flex min-w-52 max-w-52 flex-col gap-2 lg:min-w-72 lg:max-w-72 ${className}`}>
			<div
				className={`sticky top-0 flex flex-col gap-4 pb-4 ${drawer ? 'bg-neutral-100 dark:bg-neutral-900' : 'bg-white dark:bg-[#121212]'}`}
			>
				<div className="flex flex-col gap-2 pt-px">
					<div className="flex place-content-between place-items-center p-1">
						<Link href={`/docs/packages/${packageName}/${version}`} className="text-xl font-bold">
							{packageName}
						</Link>
						<div className="flex gap-2">
							<Link
								aria-label="GitHub"
								className="rounded-full"
								href="https://github.com/discordjs/discord.js"
								rel="external noopener noreferrer"
								target="_blank"
							>
								<VscGithubInverted aria-hidden size={24} />
							</Link>
							<ThemeSwitch />
						</div>
					</div>
					<PackageSelect packageName={packageName} />
					{/* <h3 className="p-1 text-lg font-semibold">{version}</h3> */}
					<VersionSelect packageName={packageName} version={version} versions={versions} />
				</div>

				<SearchButton />
			</div>

			<nav className="flex flex-col gap-4">
				{groupedNodes.class?.length ? (
					<Collapsible className="flex flex-col gap-4" defaultOpen>
						<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
							<h4 className="font-semibold">Classes</h4>
							<ChevronDown className='group-data-[state="open"]:hidden' aria-hidden size={24} />
							<ChevronUp className='group-data-[state="closed"]:hidden' aria-hidden size={24} />
						</CollapsibleTrigger>
						<CollapsibleContent>
							<div className="flex flex-col gap-1.5">
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
					<Collapsible className="flex flex-col gap-4" defaultOpen>
						<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
							<h4 className="font-semibold">Functions</h4>
							<ChevronDown className='group-data-[state="open"]:hidden' aria-hidden size={24} />
							<ChevronUp className='group-data-[state="closed"]:hidden' aria-hidden size={24} />
						</CollapsibleTrigger>
						<CollapsibleContent>
							<div className="flex flex-col gap-1.5">
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
					<Collapsible className="flex flex-col gap-4" defaultOpen>
						<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
							<h4 className="font-semibold">Enums</h4>
							<ChevronDown className='group-data-[state="open"]:hidden' aria-hidden size={24} />
							<ChevronUp className='group-data-[state="closed"]:hidden' aria-hidden size={24} />
						</CollapsibleTrigger>
						<CollapsibleContent>
							<div className="flex flex-col gap-1.5">
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
					<Collapsible className="flex flex-col gap-4" defaultOpen>
						<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
							<h4 className="font-semibold">Interfaces</h4>
							<ChevronDown className='group-data-[state="open"]:hidden' aria-hidden size={24} />
							<ChevronUp className='group-data-[state="closed"]:hidden' aria-hidden size={24} />
						</CollapsibleTrigger>
						<CollapsibleContent>
							<div className="flex flex-col gap-1.5">
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
					<Collapsible className="flex flex-col gap-4" defaultOpen>
						<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
							<h4 className="font-semibold">Types</h4>
							<ChevronDown className='group-data-[state="open"]:hidden' aria-hidden size={24} />
							<ChevronUp className='group-data-[state="closed"]:hidden' aria-hidden size={24} />
						</CollapsibleTrigger>
						<CollapsibleContent>
							<div className="flex flex-col gap-1.5">
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
					<Collapsible className="flex flex-col gap-4" defaultOpen>
						<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
							<h4 className="font-semibold">Variables</h4>
							<ChevronDown className='group-data-[state="open"]:hidden' aria-hidden size={24} />
							<ChevronUp className='group-data-[state="closed"]:hidden' aria-hidden size={24} />
						</CollapsibleTrigger>
						<CollapsibleContent>
							<div className="flex flex-col gap-1.5">
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
		</aside>
	);
}
