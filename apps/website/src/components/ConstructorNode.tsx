import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { Code2, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { ENV } from '~/util/env';
import { ParameterNode } from './ParameterNode';
import { SummaryNode } from './SummaryNode';

export async function ConstructorNode({ node, version }: { readonly node: any; readonly version: string }) {
	return (
		<div className="flex flex-col gap-8">
			<h2 className="flex place-items-center gap-2 p-2 text-xl font-bold">
				<VscSymbolMethod aria-hidden className="flex-shrink-0" size={24} />
				Constructors
			</h2>

			<div className="flex place-content-between place-items-center">
				<h3
					id="constructor"
					className={`${ENV.IS_LOCAL_DEV || ENV.IS_PREVIEW ? 'scroll-mt-16' : 'scroll-mt-8'} group break-words font-mono font-semibold`}
				>
					{/* constructor({parsedContent.constructor.parametersString}) */}
					<Link href="#constructor" className="float-left -ml-6 hidden pb-2 pr-2 group-hover:block">
						<LinkIcon aria-hidden size={16} />
					</Link>
					constructor({node.parameters?.length ? <ParameterNode node={node.parameters} version={version} /> : null})
				</h3>

				<a
					aria-label="Open source file in new tab"
					className="min-w-min"
					href={node.sourceLine ? `${node.sourceURL}#L${node.sourceLine}` : node.sourceURL}
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

			{node.summary?.summarySection.length ? (
				<SummaryNode padding node={node.summary.summarySection} version={version} />
			) : null}

			<div aria-hidden className="px-4">
				<div role="separator" className="h-[2px] bg-neutral-300 dark:bg-neutral-700" />
			</div>
		</div>
	);
}
