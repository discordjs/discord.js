import { Skeleton } from '@mantine/core';
import { useRouter } from 'next/router';
import { DocContainer } from '../DocContainer';
import { ConstructorSection, MethodsSection, PropertiesSection } from '../Sections';
import type { ApiClassJSON } from '~/DocModel/ApiNodeJSONEncoder';

export function Class({ data }: { data: ApiClassJSON }) {
	const router = useRouter();

	return (
		<DocContainer
			name={data.name}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameters}
			extendsTokens={data.extendsTokens}
			implementsTokens={data.implementsTokens}
			comment={data.comment}
			methods={data.methods}
			properties={data.properties}
		>
			{data.constructor ? <ConstructorSection data={data.constructor} /> : null}
			<Skeleton visible={router.isFallback}>
				<PropertiesSection data={data.properties} />
			</Skeleton>
			<Skeleton visible={router.isFallback}>
				<MethodsSection data={data.methods} />
			</Skeleton>
		</DocContainer>
	);
}
