import type { ApiClass } from '@microsoft/api-extractor-model';
import { ExtendsText } from '../documentation/ExtendsText';
import { MemberContainerDocumentation } from '../documentation/MemberContainerDocumentation';

export function Class({ clazz, version }: { clazz: ApiClass; version: string }) {
	return <MemberContainerDocumentation item={clazz} subheading={<ExtendsText item={clazz} />} version={version} />;
}
