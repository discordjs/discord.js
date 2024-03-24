import { DocNode } from './DocNode';

export async function ExampleNode({ node, version }: { readonly node: any; readonly version: string }) {
	return (
		<div className="break-words pl-4">
			<span className="font-semibold">Examples:</span>
			<DocNode node={node} version={version} />
		</div>
	);
}
