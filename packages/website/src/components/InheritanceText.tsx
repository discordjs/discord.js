import type { InheritanceData } from '@discordjs/api-extractor-utils';
import { Anchor, Text } from '@mantine/core';
import Link from 'next/link';

export function InheritanceText({ data }: { data: InheritanceData }) {
	return (
		<Text weight={600}>
			{'Inherited from '}
			<Link href={data.path} passHref prefetch={false}>
				<Anchor component="a" className="font-mono">
					{data.parentName}
				</Anchor>
			</Link>
		</Text>
	);
}
