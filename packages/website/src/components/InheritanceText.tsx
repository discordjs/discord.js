import type { InheritanceData } from '@discordjs/api-extractor-utils';
import { Anchor } from '@mantine/core';
import Link from 'next/link';

export function InheritanceText({ data }: { data: InheritanceData }) {
	return (
		<span className="font-semibold">
			{'Inherited from '}
			<Link href={data.path} passHref prefetch={false}>
				<Anchor component="a" className="font-mono">
					{data.parentName}
				</Anchor>
			</Link>
		</span>
	);
}
