import { Anchor, Text } from '@mantine/core';
import Link from 'next/link';
import type { InheritanceData } from '~/DocModel/DocMethod';

export function InheritanceText({ data }: { data: InheritanceData }) {
	return (
		<Text className="font-semibold">
			{'Inherited from '}
			<Link href={data.path} passHref>
				<Anchor component="a" className="font-mono">
					{data.parentName}
				</Anchor>
			</Link>
		</Text>
	);
}
