import type { ApiDeclaredItem, ApiItemContainerMixin } from '@discordjs/api-extractor-model';
import { EventsSection } from './section/EventsSection';
import { MethodsSection } from './section/MethodsSection';
import { PropertiesSection } from './section/PropertiesSection';
import { hasEvents, hasProperties, hasMethods } from './util';

export function Members({ item }: { readonly item: ApiDeclaredItem & ApiItemContainerMixin }) {
	return (
		<>
			{hasEvents(item) ? <EventsSection item={item} /> : null}
			{hasProperties(item) ? <PropertiesSection item={item} /> : null}
			{hasMethods(item) ? <MethodsSection item={item} /> : null}
		</>
	);
}
