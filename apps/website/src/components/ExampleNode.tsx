import { DocNode } from './DocNode';

export async function ExampleNode({ node, version }: { readonly node: any; readonly version: string }) {
	return (
		<div className="pl-4 break-words">
			<span className="font-semibold">Examples:</span>
			<DocNode node={node} version={version} />
		</div>
	);
}
