import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import type { Event } from '../interfaces/index.js';

export class DocumentedEvent extends DocumentedItem<Event> {
	public override serializer() {
		return {
			name: this.data.name,
			description: this.data.description,
			see: this.data.see,
			deprecated: this.data.deprecated,
			params: this.data.params?.length
				? this.data.params.map((p) => new DocumentedParam(p, this.config).serialize())
				: undefined,
			meta: new DocumentedItemMeta(this.data.meta, this.config).serialize(),
		};
	}
}
