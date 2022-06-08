import type { DeclarationReflection, SignatureReflection } from 'typedoc';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import type { Event } from '../interfaces/index.js';

export class DocumentedEvent extends DocumentedItem<Event | DeclarationReflection> {
	public override serializer() {
		if (this.config.typescript) {
			const data = this.data as DeclarationReflection;
			const signature = (data.signatures ?? [])[0] ?? data;
			let meta;

			const sources = data.sources?.[0];
			if (sources) {
				meta = new DocumentedItemMeta(sources, this.config).serialize();
			}

			return {
				name: data.name,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				description: signature.comment?.shortText?.trim(),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				see: signature.comment?.tags?.filter((t) => t.tagName === 'see').map((t) => t.text.trim()),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				deprecated: signature.comment?.tags?.some((t) => t.tagName === 'deprecated'),
				// @ts-expect-error
				params: signature.parameters
					? (signature as SignatureReflection).parameters?.map((p) => new DocumentedParam(p, this.config))
					: undefined,
				meta,
			};
		}

		const data = this.data as Event;
		return {
			name: data.name,
			description: data.description,
			see: data.see,
			deprecated: data.deprecated,
			params: data.params?.length ? data.params.map((p) => new DocumentedParam(p, this.config).serialize()) : undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
