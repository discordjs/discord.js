import type { DeclarationReflection, SignatureReflection } from 'typedoc';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import type { Constructor } from '../interfaces/index.js';

export class DocumentedConstructor extends DocumentedItem<Constructor | DeclarationReflection> {
	public override serializer() {
		if (this.config.typescript) {
			const data = this.data as DeclarationReflection;
			const signature = (data.signatures ?? [])[0] ?? data;

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const see = signature.comment?.blockTags?.filter((t) => t.tag === '@see').length
				? signature.comment.blockTags
						.filter((t) => t.tag === '@see')
						.map((t) => t.content.find((c) => c.kind === 'text')?.text.trim())
				: undefined;

			return {
				name: signature.name,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-nullish-coalescing
				description: signature.comment?.summary?.reduce((prev, curr) => (prev += curr.text), '').trim() || undefined,
				see,
				access:
					data.flags.isPrivate ||
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					signature.comment?.blockTags?.some((t) => t.tag === '@private' || t.tag === '@internal')
						? 'private'
						: undefined,
				// @ts-expect-error
				params: signature.parameters
					? (signature as SignatureReflection).parameters?.map((p) => new DocumentedParam(p, this.config).serialize())
					: undefined,
			};
		}

		const data = this.data as Constructor;
		return {
			name: data.name,
			description: data.description,
			see: data.see,
			access: data.access,
			params: data.params?.length ? data.params.map((p) => new DocumentedParam(p, this.config).serialize()) : undefined,
		};
	}
}
