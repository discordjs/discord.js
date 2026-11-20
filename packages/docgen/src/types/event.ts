import type { Event } from '../interfaces/index.js';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';

export class DocumentedEvent extends DocumentedItem<Event> {
	public override serializer() {
		const data = this.data;
		return {
			name: data.name,
			description: data.description,
			see: data.see,
			deprecated: data.deprecated,
			params: data.params?.length
				? data.params.map((param) => new DocumentedParam(param, this.config).serialize())
				: undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
