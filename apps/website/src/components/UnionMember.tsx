import { ExcerptNode } from './ExcerptNode';

export async function UnionMember({ node, version }: { readonly node: any; readonly version: string }) {
	return (
		<div className="flex flex-col gap-4">
			{node.length > 1 ? <h2 className="flex place-items-center gap-2 p-2 text-xl font-bold">Union Members</h2> : null}

			<span className="flex flex-col gap-4 px-2 font-mono text-sm break-words">
				<ExcerptNode node={node} version={version} />
			</span>
		</div>
	);
}
