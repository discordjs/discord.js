import { DocNode } from './DocNode';

export async function ReturnNode({
	padding = false,
	node,
	version,
}: {
	readonly node: any;
	readonly padding?: boolean;
	readonly version: string;
}) {
	return (
		<p className={`break-words ${padding ? 'pl-4' : ''}`}>
			<span className="font-semibold">Returns:</span> <DocNode node={node} version={version} />
		</p>
	);
}
