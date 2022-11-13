import type { InheritanceData } from '@discordjs/api-extractor-utils';
import Link from 'next/link';

export function InheritanceText({ data }: { data: InheritanceData }) {
	return (
		<span className="font-semibold">
			Inherited from{' '}
			<Link href={data.path} prefetch={false}>
				<a className="text-blurple focus:ring-width-2 focus:ring-blurple rounded font-mono outline-0 focus:ring">
					{data.parentName}
				</a>
			</Link>
		</span>
	);
}
