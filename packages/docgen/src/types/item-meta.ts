import { relative } from 'node:path';
import { DocumentedItem } from './item.js';
import type { Meta } from '../interfaces/index.js';

export class DocumentedItemMeta extends DocumentedItem<Meta> {
	public override serializer() {
		return {
			line: this.data.lineno,
			file: this.data.filename,
			path: relative(this.config.root, this.data.path).replace(/\\/g, '/'),
		};
	}
}
