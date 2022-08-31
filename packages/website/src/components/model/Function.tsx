import type { ApiFunctionJSON } from '@discordjs/api-extractor-utils';
import { Skeleton } from '@mantine/core';
import { useRouter } from 'next/router';
import { DocContainer } from '../DocContainer.jsx';
import { ParametersSection } from '../Sections.jsx';

export function Function({ data }: { data: ApiFunctionJSON }) {
	const router = useRouter();

	return (
		<DocContainer
			name={`${data.name}${data.overloadIndex && data.overloadIndex > 1 ? ` (${data.overloadIndex})` : ''}`}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameters}
		>
			<Skeleton visible={router.isFallback} radius="sm">
				<ParametersSection data={data.parameters} />
			</Skeleton>
		</DocContainer>
	);
}
