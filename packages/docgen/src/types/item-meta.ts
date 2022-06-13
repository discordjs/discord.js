import { basename, relative } from 'node:path';
import type { SourceReference } from 'typedoc';
import { DocumentedItem } from './item.js';
import type { Meta } from '../interfaces/index.js';

export class DocumentedItemMeta extends DocumentedItem<Meta | SourceReference> {
	public override serializer() {
		if (this.config.typescript) {
			const data = this.data as SourceReference;

			return {
				line: data.line,
				file: basename(data.fileName),
				path: undefined,
				url: data.url,
			};
		}

		const data = this.data as Meta;
		return {
			line: data.lineno,
			file: data.filename,
			path: relative(this.config.root, data.path).replace(/\\/g, '/'),
		};
	}
}
