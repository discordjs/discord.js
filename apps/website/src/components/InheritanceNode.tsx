import { ExcerptNode } from './ExcerptNode';

export async function InheritanceNode({
	text,
	node,
	version,
}: {
	readonly node: any;
	readonly text: string;
	readonly version: string;
}) {
	return (
		<div>
			<h2 className="inline-block min-w-min text-sm italic text-neutral-500 dark:text-neutral-400">{text}</h2>{' '}
			<span className="break-words font-mono text-sm">
				<ExcerptNode node={node} version={version} />
			</span>
		</div>
	);
}
