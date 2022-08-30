import type { ApiInterfaceJSON } from '@discordjs/api-extractor-utils';
import { Skeleton } from '@mantine/core';
import { useRouter } from 'next/router';
import { DocContainer } from '../DocContainer';
import { MethodsSection, PropertiesSection } from '../Sections';

export function Interface({ data }: { data: ApiInterfaceJSON }) {
	const router = useRouter();

	return (
		<DocContainer
			name={data.name}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameters}
			methods={data.methods}
			properties={data.properties}
		>
			<Skeleton visible={router.isFallback} radius="sm">
				<PropertiesSection data={data.properties} />
			</Skeleton>
			<Skeleton visible={router.isFallback} radius="sm">
				<MethodsSection data={data.methods} />
			</Skeleton>
		</DocContainer>
	);
}
