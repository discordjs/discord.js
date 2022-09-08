import type { DeclarationReflection, SignatureReflection } from 'typedoc';
import type { Constructor } from '../interfaces/index.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';

export class DocumentedConstructor extends DocumentedItem<Constructor | DeclarationReflection> {
	public override serializer() {
		if (this.config.typescript) {
			const data = this.data as DeclarationReflection;
			const signature = (data.signatures ?? [])[0] ?? data;

			const see = signature.comment?.blockTags?.filter((block) => block.tag === '@see').length
				? signature.comment.blockTags
						.filter((block) => block.tag === '@see')
						.map((block) => block.content.find((textContent) => textContent.kind === 'text')?.text.trim())
				: undefined;

			return {
				name: signature.name,
				// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, no-param-reassign
				description: signature.comment?.summary?.reduce((prev, curr) => (prev += curr.text), '').trim() || undefined,
				see,
				access:
					data.flags.isPrivate ||
					signature.comment?.blockTags?.some((block) => block.tag === '@private' || block.tag === '@internal')
						? 'private'
						: undefined,
				// @ts-expect-error: No type for params
				params: signature.parameters
					? (signature as SignatureReflection).parameters?.map((param) =>
							new DocumentedParam(param, this.config).serialize(),
					  )
					: undefined,
			};
		}

		const data = this.data as Constructor;
		return {
			name: data.name,
			description: data.description,
			see: data.see,
			access: data.access,
			params: data.params?.length
				? data.params.map((param) => new DocumentedParam(param, this.config).serialize())
				: undefined,
		};
	}
}
