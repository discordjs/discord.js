import { ExcerptNode } from './ExcerptNode';

export async function UnionMember({ node, version }: { readonly node: any; readonly version: string }) {
	return (
		<div className="flex flex-col gap-8">
			<h2 className="flex place-items-center gap-2 p-2 text-xl font-bold">Union Members</h2>

			<span className="flex flex-col gap-4 break-words font-mono text-sm">
				<ExcerptNode node={node} version={version} />
			</span>
		</div>
	);
}
