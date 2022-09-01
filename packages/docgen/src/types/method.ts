import type { DeclarationReflection, SignatureReflection } from 'typedoc';
import type { Method } from '../interfaces/index.js';
import { parseType } from '../util/parseType.js';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';

export class DocumentedMethod extends DocumentedItem<DeclarationReflection | Method> {
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
			const see = signature.comment?.blockTags?.filter((block) => block.tag === '@see').length
				? signature.comment.blockTags
						.filter((block) => block.tag === '@see')
						.map((block) => block.content.find((innerContent) => innerContent.kind === 'text')?.text.trim())
				: undefined;

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const examples = signature.comment?.blockTags?.filter((block) => block.tag === '@example').length
				? signature.comment.blockTags
						.filter((block) => block.tag === '@example')
						// eslint-disable-next-line no-param-reassign
						.map((block) => block.content.reduce((prev, curr) => (prev += curr.text), '').trim())
				: undefined;

			return {
				name: signature.name,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-nullish-coalescing, no-param-reassign
				description: signature.comment?.summary?.reduce((prev, curr) => (prev += curr.text), '').trim() || undefined,
				see,
				scope: data.flags.isStatic ? 'static' : undefined,
				access:
					data.flags.isPrivate ||
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					signature.comment?.blockTags?.some((block) => block.tag === '@private' || block.tag === '@internal')
						? 'private'
						: undefined,
				examples,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-nullish-coalescing
				abstract: signature.comment?.blockTags?.some((block) => block.tag === '@abstract') || undefined,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				deprecated: signature.comment?.blockTags?.some((block) => block.tag === '@deprecated')
					? signature.comment.blockTags
							.find((block) => block.tag === '@deprecated')
							// eslint-disable-next-line no-param-reassign
							?.content.reduce((prev, curr) => (prev += curr.text), '')
							.trim() ?? true
					: undefined,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				// emits: signature.comment?.blockTags?.filter((t) => t.tag === '@emits').map((t) => t.content),
				// @ts-expect-error: Typescript doesn't know that this is a SignatureReflection
				params: signature.parameters
					? (signature as SignatureReflection).parameters?.map((param) =>
							new DocumentedParam(param, this.config).serialize(),
					  )
					: undefined,
				returns: signature.type
					? [
							new DocumentedVarType(
								{
									names: [parseType(signature.type)],
									description:
										signature.comment?.blockTags
											// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
											?.find((block) => block.tag === '@returns')
											// eslint-disable-next-line no-param-reassign
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
						?.find((block) => block.tag === '@returns')
						// eslint-disable-next-line no-param-reassign
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
			params: data.params?.length
				? data.params.map((param) => new DocumentedParam(param, this.config).serialize())
				: undefined,
			async: data.async,
			generator: data.generator,
			returns: data.returns?.length
				? data.returns.map((param) =>
						new DocumentedVarType(
							{ names: param.type.names, description: param.description, nullable: param.nullable },
							this.config,
						).serialize(),
				  )
				: undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
