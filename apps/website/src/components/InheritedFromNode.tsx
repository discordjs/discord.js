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
		<p className="pl-4 break-words">
			<span className="font-semibold">Inherited from:</span>{' '}
			<Link
				className="text-base-blurple-400 hover:text-base-blurple-500 dark:hover:text-base-blurple-300 font-mono"
				href={`/docs/packages/${packageName}/${version}/${node}`}
				// @ts-expect-error - unstable_dynamicOnHover is not part of the public types
				unstable_dynamicOnHover
			>
				{node.slice(0, node.indexOf(':'))}
			</Link>
		</p>
	);
}
