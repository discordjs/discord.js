import type { DeclarationReflection, SignatureReflection } from 'typedoc';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import type { Constructor } from '../interfaces/index.js';

export class DocumentedConstructor extends DocumentedItem<Constructor | DeclarationReflection> {
	public override serializer() {
		if (this.config.typescript) {
			const data = this.data as DeclarationReflection;
			const signature = (data.signatures ?? [])[0] ?? data;

			return {
				name: data.name,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				description: signature.comment?.shortText?.trim(),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				see: signature.comment?.tags?.filter((t) => t.tagName === 'see').map((t) => t.text.trim()),
				access:
					data.flags.isPrivate ||
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					signature.comment?.tags?.some((t) => t.tagName === 'private' || t.tagName === 'internal')
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
