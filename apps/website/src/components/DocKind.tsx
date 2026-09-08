export function resolveNodeKind(kind: string) {
	switch (kind) {
		case 'Class':
			return {
				text: 'text-green-500',
				background: 'bg-green-500/20',
			};
		case 'Interface':
			return {
				text: 'text-amber-500',
				background: 'bg-amber-500/20',
			};
		case 'Function':
			return {
				text: 'text-blue-500',
				background: 'bg-blue-500/20',
			};
		case 'Enum':
			return {
				text: 'text-rose-500',
				background: 'bg-rose-500/20',
			};
		case 'TypeAlias':
			return {
				text: 'text-pink-500',
				background: 'bg-pink-500/20',
			};
		case 'Variable':
			return {
				text: 'text-purple-500',
				background: 'bg-purple-500/20',
			};
		default:
			return {
				text: 'text-gray-500',
				background: 'bg-gray-500/20',
			};
	}
}

export async function DocKind({ background = false, node }: { readonly background?: boolean; readonly node: any }) {
	const kind = resolveNodeKind(node.kind);
	return <span className={background ? `${kind.background} ${kind.text}` : kind.text}>{node.kind.toLowerCase()}</span>;
}
