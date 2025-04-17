import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { Code2, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { ENV } from '@/util/env';
import { ParameterNode } from './ParameterNode';
import { SummaryNode } from './SummaryNode';

export async function ConstructorNode({ node, version }: { readonly node: any; readonly version: string }) {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="flex place-items-center gap-2 p-2 text-xl font-bold">
				<VscSymbolMethod aria-hidden className="flex-shrink-0" size={24} />
				Constructors
			</h2>

			<div className="flex place-content-between place-items-center gap-1">
				<h3
					className={`${ENV.IS_LOCAL_DEV || ENV.IS_PREVIEW ? 'scroll-mt-16' : 'scroll-mt-8'} group px-2 font-mono font-semibold break-all`}
					id="constructor"
				>
					{/* constructor({parsedContent.constructor.parametersString}) */}
					<Link className="float-left -ml-6 hidden pr-2 pb-2 group-hover:block" href="#constructor">
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
						className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300"
						size={20}
					/>
				</a>
			</div>

			{node.summary?.summarySection.length ? (
				<SummaryNode node={node.summary.summarySection} padding version={version} />
			) : null}

			<div aria-hidden className="p-4">
				<div className="h-[2px] bg-neutral-300 dark:bg-neutral-700" role="separator" />
			</div>
		</div>
	);
}
