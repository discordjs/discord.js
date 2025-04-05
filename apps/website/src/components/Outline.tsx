import { VscListSelection } from '@react-icons/all-files/vsc/VscListSelection';
import { VscSymbolEvent } from '@react-icons/all-files/vsc/VscSymbolEvent';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/Collapsible';

export async function Outline({ node }: { readonly node: any }) {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	const hasAny = node.members?.properties?.length || node.members?.events?.length || node.members?.methods?.length;

	return hasAny ? (
		<Collapsible className="flex flex-col gap-8" defaultOpen>
			<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
				<h2 className="flex place-items-center gap-2 text-xl font-bold">
					<VscListSelection aria-hidden className="flex-shrink-0" size={24} /> Table of contents
				</h2>
				<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
				<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="flex flex-col gap-8">
					<div className="grid gap-2 sm:grid-cols-2">
						{node.members?.properties?.length ? (
							<Collapsible className="flex flex-col gap-4 px-4" defaultOpen>
								<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
									<h2 className="flex place-items-center gap-2 text-xl font-bold">
										<VscSymbolProperty aria-hidden className="flex-shrink-0" size={24} />
										Properties
									</h2>
									<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
									<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
								</CollapsibleTrigger>

								<CollapsibleContent>
									<div className="flex flex-col gap-2 px-4">
										{node.members.properties.map((property: any, idx: number) => (
											<Fragment key={`${property.displayName}-${idx}`}>
												<div className="flex flex-col gap-4">
													<div className="flex place-content-between place-items-center">
														<Link
															className="grow truncate rounded-md p-2 font-mono transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 md:px-1 md:py-1"
															href={`#${property.displayName}`}
														>
															{property.displayName}
														</Link>
													</div>
												</div>
											</Fragment>
										))}
									</div>
								</CollapsibleContent>
							</Collapsible>
						) : null}

						{node.members?.methods?.length ? (
							<Collapsible className="flex flex-col gap-4 px-4" defaultOpen>
								<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
									<h2 className="flex place-items-center gap-2 text-xl font-bold">
										<VscSymbolMethod aria-hidden className="flex-shrink-0" size={24} />
										Methods
									</h2>
									<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
									<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
								</CollapsibleTrigger>

								<CollapsibleContent>
									<div className="flex flex-col gap-2 px-4">
										{node.members.methods.map((method: any, idx: number) => (
											<Fragment key={`${method.displayName}-${idx}`}>
												<div className="flex flex-col gap-4">
													<div className="flex place-content-between place-items-center">
														<Link
															className="grow truncate rounded-md p-2 font-mono transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 md:px-1 md:py-1"
															href={`#${method.displayName}`}
														>
															{method.displayName}
														</Link>
													</div>
												</div>
											</Fragment>
										))}
									</div>
								</CollapsibleContent>
							</Collapsible>
						) : null}

						{node.members?.events?.length ? (
							<Collapsible className="flex flex-col gap-4 px-4" defaultOpen>
								<CollapsibleTrigger className="group flex place-content-between place-items-center rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
									<h2 className="flex place-items-center gap-2 text-xl font-bold">
										<VscSymbolEvent aria-hidden className="flex-shrink-0" size={24} />
										Events
									</h2>
									<ChevronDown aria-hidden className='group-data-[state="open"]:hidden' size={24} />
									<ChevronUp aria-hidden className='group-data-[state="closed"]:hidden' size={24} />
								</CollapsibleTrigger>

								<CollapsibleContent>
									<div className="flex flex-col gap-2 px-4">
										{node.members.events.map((event: any, idx: number) => (
											<Fragment key={`${event.displayName}-${idx}`}>
												<div className="flex flex-col gap-4">
													<div className="flex place-content-between place-items-center">
														<Link
															className="grow truncate rounded-md p-2 font-mono transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 md:px-1 md:py-1"
															href={`#${event.displayName}`}
														>
															{event.displayName}
														</Link>
													</div>
												</div>
											</Fragment>
										))}
									</div>
								</CollapsibleContent>
							</Collapsible>
						) : null}
					</div>
					<div aria-hidden className="px-4">
						<div className="h-[2px] bg-neutral-300 dark:bg-neutral-700" role="separator" />
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	) : null;
}
