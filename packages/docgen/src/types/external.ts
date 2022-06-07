import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import type { External } from '../interfaces/index.js';

export class DocumentedExternal extends DocumentedItem<External> {
	public override serializer() {
		return {
			name: this.data.name,
			description: this.data.description,
			see: this.data.see,
			meta: new DocumentedItemMeta(this.data.meta, this.config).serialize(),
		};
	}
}
