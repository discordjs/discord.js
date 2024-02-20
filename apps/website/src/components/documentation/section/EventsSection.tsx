import {
	ApiItemKind,
	type ApiEvent,
	type ApiItem,
	type ApiItemContainerMixin,
	type ApiDeclaredItem,
} from '@discordjs/api-extractor-model';
import { VscSymbolEvent } from '@react-icons/all-files/vsc/VscSymbolEvent';
import { Fragment, useMemo } from 'react';
import { Event } from '~/components/model/Event';
import { resolveMembers } from '~/util/members';
import { DocumentationSection } from './DocumentationSection';

function isEventLike(item: ApiItem): item is ApiEvent {
	return item.kind === ApiItemKind.Event;
}

export function EventsSection({ item }: { readonly item: ApiItemContainerMixin }) {
	const members = resolveMembers(item, isEventLike);

	const eventItems = useMemo(
		() =>
			members.map((event, idx) => {
				return (
					<Fragment key={`${event.item.displayName}-${idx}`}>
						<Event
							inheritedFrom={event.inherited as ApiDeclaredItem & ApiItemContainerMixin}
							item={event.item as ApiEvent}
						/>
						<div className="border-t-2 border-light-900 dark:border-dark-100" />
					</Fragment>
				);
			}),
		[members],
	);

	return (
		<DocumentationSection icon={<VscSymbolEvent size={20} />} padded title="Events">
			<div className="flex flex-col gap-4">{eventItems}</div>
		</DocumentationSection>
	);
}
