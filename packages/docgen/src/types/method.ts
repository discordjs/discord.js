import type { DeclarationReflection, SignatureReflection } from 'typedoc';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';
import type { Method } from '../interfaces/index.js';
import { parseType } from '../util/parseType.js';

export class DocumentedMethod extends DocumentedItem<Method | DeclarationReflection> {
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
				name: signature.name,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-nullish-coalescing
				description: signature.comment?.summary?.reduce((prev, curr) => (prev += curr.text), '').trim() || undefined,
				see,
				scope: data.flags.isStatic ? 'static' : undefined,
				access:
					data.flags.isPrivate ||
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					signature.comment?.blockTags?.some((t) => t.tag === '@private' || t.tag === '@internal')
						? 'private'
						: undefined,
				examples,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-nullish-coalescing
				abstract: signature.comment?.blockTags?.some((t) => t.tag === '@abstract') || undefined,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				deprecated: signature.comment?.blockTags?.some((t) => t.tag === '@deprecated')
					? signature.comment.blockTags
							.find((t) => t.tag === '@deprecated')
							?.content.reduce((prev, curr) => (prev += curr.text), '')
							.trim() ?? true
					: undefined,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				// emits: signature.comment?.blockTags?.filter((t) => t.tag === '@emits').map((t) => t.content),
				// @ts-expect-error
				params: signature.parameters
					? (signature as SignatureReflection).parameters?.map((p) => new DocumentedParam(p, this.config).serialize())
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

		const data = this.data as Method;
		return {
			name: data.name,
			description: data.description,
			see: data.see,
			scope: data.scope,
			access: data.access,
			inherits: data.inherits,
			inherited: data.inherited,
			implements: data.implements,
			examples: data.examples,
			abstract: data.virtual && !data.inherited,
			deprecated: data.deprecated,
			emits: data.fires,
			throws: data.exceptions,
			params: data.params?.length ? data.params.map((p) => new DocumentedParam(p, this.config).serialize()) : undefined,
			async: data.async,
			generator: data.generator,
			returns: data.returns?.length
				? data.returns.map((p) =>
						new DocumentedVarType(
							{ names: p.type.names, description: p.description, nullable: p.nullable },
							this.config,
						).serialize(),
				  )
				: undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
