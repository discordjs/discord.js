import { VscSymbolEnumMember } from '@react-icons/all-files/vsc/VscSymbolEnumMember';
import { Code2, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
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
import { UnstableNode } from './UnstableNode';

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
		<div className="flex flex-col gap-4">
			<h2 className="flex place-items-center gap-2 p-2 text-xl font-bold">
				<VscSymbolEnumMember aria-hidden className="flex-shrink-0" size={24} />
				Members
			</h2>

			<div className="flex flex-col gap-4">
				{node.map((enumMember: any, idx: number) => (
					<Fragment key={`${enumMember.displayName}-${idx}`}>
						<div className="flex flex-col gap-4">
							<div className="flex place-content-between place-items-center gap-1">
								<h3
									className={`${ENV.IS_LOCAL_DEV || ENV.IS_PREVIEW ? 'scroll-mt-16' : 'scroll-mt-8'} group px-2 font-mono font-semibold break-all`}
									id={enumMember.displayName}
								>
									<Badges node={enumMember} />
									<span>
										<Link
											className="float-left -ml-6 hidden pr-2 pb-2 group-hover:block"
											href={`#${enumMember.displayName}`}
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
										className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300"
										size={20}
									/>
								</a>
							</div>

							{enumMember.summary?.deprecatedBlock.length ? (
								<DeprecatedNode deprecatedBlock={enumMember.summary.deprecatedBlock} version={version} />
							) : null}

							{enumMember.summary?.unstableBlock?.length ? (
								<UnstableNode unstableBlock={enumMember.summary.unstableBlock} version={version} />
							) : null}

							{enumMember.summary?.summarySection.length ? (
								<SummaryNode node={enumMember.summary.summarySection} padding version={version} />
							) : null}

							{enumMember.summary?.exampleBlocks.length ? (
								<ExampleNode node={enumMember.summary.exampleBlocks} version={version} />
							) : null}

							{enumMember.summary?.returnsBlock.length ? (
								<ReturnNode node={enumMember.summary.returnsBlock} padding version={version} />
							) : null}

							{enumMember.inheritedFrom ? (
								<InheritedFromNode node={enumMember.inheritedFrom} packageName={packageName} version={version} />
							) : null}

							{enumMember.summary?.seeBlocks.length ? (
								<SeeNode node={enumMember.summary.seeBlocks} padding version={version} />
							) : null}
						</div>
						<div aria-hidden className="p-4">
							<div className="h-[2px] bg-neutral-300 dark:bg-neutral-700" role="separator" />
						</div>
					</Fragment>
				))}
			</div>
		</div>
	);
}
