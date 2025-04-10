import { FileCode2 } from 'lucide-react';
import { Badges } from './Badges';
import { DocKind } from './DocKind';
import { InheritanceNode } from './InheritanceNode';

export async function InformationNode({ node, version }: { readonly node: any; readonly version: string }) {
	return (
		<div className="flex place-content-between place-items-center gap-1">
			<div className="flex flex-col gap-1">
				<h1 className="text-xl">
					<DocKind node={node} /> <span className="font-bold break-all">{node.displayName}</span>
				</h1>
				{node.implements ? <InheritanceNode node={node.implements} text="implements" version={version} /> : null}
				{node.extends ? <InheritanceNode node={node.extends} text="extends" version={version} /> : null}
				<Badges node={node} />
			</div>

			<a
				aria-label="Open source file in new tab"
				className="min-w-min"
				href={node.sourceLine ? `${node.sourceURL}#L${node.sourceLine}` : node.sourceURL}
				rel="external noreferrer noopener"
				target="_blank"
			>
				<FileCode2
					aria-hidden
					className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300"
					size={20}
				/>
			</a>
		</div>
	);
}
