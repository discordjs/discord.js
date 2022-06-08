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

			return {
				name: data.name,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				description: signature.comment?.shortText?.trim(),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				see: signature.comment?.tags?.filter((t) => t.tagName === 'see').map((t) => t.text.trim()),
				scope: data.flags.isStatic ? 'static' : undefined,
				access:
					data.flags.isPrivate ||
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					signature.comment?.tags?.some((t) => t.tagName === 'private' || t.tagName === 'internal')
						? 'private'
						: undefined,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				examples: signature.comment?.tags?.filter((t) => t.tagName === 'example').map((t) => t.text.trim()),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				abstract: signature.comment?.tags?.some((t) => t.tagName === 'abstract'),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				deprecated: signature.comment?.tags?.some((t) => t.tagName === 'deprecated'),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				emits: signature.comment?.tags?.filter((t) => t.tagName === 'emits').map((t) => t.text.trim()),
				// @ts-expect-error
				params: signature.parameters
					? (signature as SignatureReflection).parameters?.map((p) => new DocumentedParam(p, this.config))
					: undefined,
				returns: signature.type
					? new DocumentedVarType(
							{ names: [parseType(signature.type)], description: signature.comment?.returns?.trim() },
							this.config,
					  ).serialize()
					: undefined,
				returnsDescription: signature.comment?.returns?.trim(),
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
