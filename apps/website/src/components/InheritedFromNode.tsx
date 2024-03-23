import Link from 'next/link';

export async function InheritedFromNode({
	node,
	packageName,
	version,
}: {
	readonly node: any;
	readonly packageName: string;
	readonly version: string;
}) {
	return (
		<p className="break-words pl-4">
			<span className="font-semibold">Inherited from:</span>{' '}
			<Link
				className="font-mono text-blurple hover:text-blurple-500 dark:hover:text-blurple-300"
				href={`/docs/packages/${packageName}/${version}/${node}`}
			>
				{node.slice(0, node.indexOf(':'))}
			</Link>
		</p>
	);
}
