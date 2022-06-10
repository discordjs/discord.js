import type { DeclarationReflection, SignatureReflection } from 'typedoc';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';
import type { Event } from '../interfaces/index.js';
import { parseType } from '../util/parseType.js';

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

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const see = signature.comment?.blockTags?.filter((t) => t.tag === '@see').length
				? signature.comment.blockTags
						.filter((t) => t.tag === '@see')
						.map((t) => t.content.find((c) => c.kind === 'text')?.text.trim())
				: undefined;

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const examples = signature.comment?.blockTags?.filter((t) => t.tag === '@example').length
				? signature.comment.blockTags
						.filter((t) => t.tag === '@example')
						.map((t) => t.content.reduce((prev, curr) => (prev += curr.text), '').trim())
				: undefined;

			return {
				// @ts-expect-error
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				name: signature.parameters?.[0]?.type?.value,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-nullish-coalescing
				description: signature.comment?.summary?.reduce((prev, curr) => (prev += curr.text), '').trim() || undefined,
				see,
				access:
					data.flags.isPrivate ||
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					signature.comment?.blockTags?.some((t) => t.tag === '@private' || t.tag === '@internal')
						? 'private'
						: undefined,
				examples,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				deprecated: signature.comment?.blockTags?.some((t) => t.tag === '@deprecated')
					? signature.comment.blockTags
							.find((t) => t.tag === '@deprecated')
							?.content.reduce((prev, curr) => (prev += curr.text), '')
							.trim() ?? true
					: undefined,
				// @ts-expect-error
				params: signature.parameters
					? (signature as SignatureReflection).parameters
							?.slice(1)
							.map((p) => new DocumentedParam(p, this.config).serialize())
					: undefined,
				returns: signature.type
					? [
							new DocumentedVarType(
								{
									names: [parseType(signature.type)],
									description:
										signature.comment?.blockTags
											// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
											?.find((t) => t.tag === '@returns')
											?.content.reduce((prev, curr) => (prev += curr.text), '')
											// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
											.trim() || undefined,
								},
								this.config,
							).serialize(),
					  ]
					: undefined,
				returnsDescription:
					signature.comment?.blockTags
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						?.find((t) => t.tag === '@returns')
						?.content.reduce((prev, curr) => (prev += curr.text), '')
						// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
						.trim() || undefined,
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
