import { VscSymbolEnumMember } from '@react-icons/all-files/vsc/VscSymbolEnumMember';
import { Code2, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { ENV } from '~/util/env';
import { Badges } from './Badges';
import { DeprecatedNode } from './DeprecatedNode';
import { ExampleNode } from './ExampleNode';
import { ExcerptNode } from './ExcerptNode';
import { InheritedFromNode } from './InheritedFromNode';
import { ParameterNode } from './ParameterNode';
import { ReturnNode } from './ReturnNode';
import { SeeNode } from './SeeNode';
import { SummaryNode } from './SummaryNode';

export async function EnumMemberNode({
	node,
	packageName,
	version,
}: {
	readonly node: any;
	readonly packageName: string;
	readonly version: string;
}) {
	return (
		<div className="flex flex-col gap-8">
			<h2 className="flex place-items-center gap-2 p-2 text-xl font-bold">
				<VscSymbolEnumMember aria-hidden className="flex-shrink-0" size={24} />
				Members
			</h2>

			<div className="flex flex-col gap-8">
				{node.map((enumMember: any, idx: number) => {
					return (
						<Fragment key={`${enumMember.displayName}-${idx}`}>
							<div className="flex flex-col gap-4">
								<div className="flex place-content-between place-items-center">
									<h3
										id={enumMember.displayName}
										className={`${ENV.IS_LOCAL_DEV || ENV.IS_PREVIEW ? 'scroll-mt-16' : 'scroll-mt-8'} group break-words font-mono font-semibold`}
									>
										<Badges node={enumMember} />
										<span>
											<Link
												href={`#${enumMember.displayName}`}
												className="float-left -ml-6 hidden pb-2 pr-2 group-hover:block"
											>
												<LinkIcon aria-hidden size={16} />
											</Link>
											{enumMember.displayName}
											{enumMember.parameters?.length ? (
												<ParameterNode node={enumMember.parameters} version={version} />
											) : null}
											{enumMember.initializerExcerpt ? (
												<>
													{' = '}
													<ExcerptNode node={enumMember.initializerExcerpt} version={version} />
												</>
											) : null}
										</span>
									</h3>

									<a
										aria-label="Open source file in new tab"
										className="min-w-min"
										href={
											enumMember.sourceLine ? `${enumMember.sourceURL}#L${enumMember.sourceLine}` : enumMember.sourceURL
										}
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

								{enumMember.summary?.deprecatedBlock.length ? (
									<DeprecatedNode deprecatedBlock={enumMember.summary.deprecatedBlock} version={version} />
								) : null}

								{enumMember.summary?.summarySection.length ? (
									<SummaryNode padding node={enumMember.summary.summarySection} version={version} />
								) : null}

								{enumMember.summary?.exampleBlocks.length ? (
									<ExampleNode node={enumMember.summary.exampleBlocks} version={version} />
								) : null}

								{enumMember.summary?.returnsBlock.length ? (
									<ReturnNode padding node={enumMember.summary.returnsBlock} version={version} />
								) : null}

								{enumMember.inheritedFrom ? (
									<InheritedFromNode node={enumMember.inheritedFrom} packageName={packageName} version={version} />
								) : null}

								{enumMember.summary?.seeBlocks.length ? (
									<SeeNode padding node={enumMember.summary.seeBlocks} version={version} />
								) : null}
							</div>
							<div aria-hidden className="px-4">
								<div role="separator" className="h-[2px] bg-neutral-300 dark:bg-neutral-700" />
							</div>
						</Fragment>
					);
				})}
			</div>
		</div>
	);
}
