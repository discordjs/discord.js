import type { ApiDeclaredItem, ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { MethodsSection } from './section/MethodsSection';
import { PropertiesSection } from './section/PropertiesSection';
import { hasProperties, hasMethods } from './util';

export function Members({ item }: { item: ApiDeclaredItem & ApiItemContainerMixin }) {
	return (
		<>
			{hasProperties(item) ? <PropertiesSection item={item} /> : null}
			{hasMethods(item) ? <MethodsSection item={item} /> : null}
		</>
	);
}
