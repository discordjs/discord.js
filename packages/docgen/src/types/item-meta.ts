import { relative } from 'node:path';
import type { Meta } from '../interfaces/index.js';
import { DocumentedItem } from './item.js';

export class DocumentedItemMeta extends DocumentedItem<Meta> {
	public override serializer() {
		const data = this.data;
		return {
			line: data.lineno,
			file: data.filename,
			path: relative(this.config.root, data.path).replaceAll('\\', '/'),
		};
	}
}
