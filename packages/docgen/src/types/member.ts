import type { DeclarationReflection } from 'typedoc';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';
import type { Member } from '../interfaces/index.js';
import { parseType } from '../util/parseType.js';

export class DocumentedMember extends DocumentedItem<Member | DeclarationReflection> {
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

			const base = {
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
				readonly: data.flags.isReadonly,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-nullish-coalescing
				abstract: signature.comment?.blockTags?.some((t) => t.tag === '@abstract') || undefined,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				deprecated: signature.comment?.blockTags?.some((t) => t.tag === '@deprecated')
					? signature.comment.blockTags
							.find((t) => t.tag === '@deprecated')
							?.content.reduce((prev, curr) => (prev += curr.text), '')
							.trim() ?? true
					: undefined,
				default:
					(data.defaultValue === '...' ? undefined : data.defaultValue) ??
					(signature.comment?.blockTags
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						?.find((t) => t.tag === '@default')
						?.content.reduce((prev, curr) => (prev += curr.text), '')
						// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
						.trim() ||
						undefined),
				type: signature.type
					? new DocumentedVarType({ names: [parseType(signature.type)] }, this.config).serialize()
					: undefined,
				meta,
			};

			if (data.kindString === 'Accessor') {
				const getter = data.getSignature;
				const hasSetter = data.setSignature;

				if (!getter) {
					throw new Error("Can't parse accessor without getter.");
				}

				if (!hasSetter) {
					base.readonly = true;
				}

				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				const see = getter.comment?.blockTags?.filter((t) => t.tag === '@see').length
					? getter.comment.blockTags
							.filter((t) => t.tag === '@see')
							.map((t) => t.content.find((c) => c.kind === 'text')?.text.trim())
					: undefined;

				return {
					...base,
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-nullish-coalescing
					description: getter.comment?.summary?.reduce((prev, curr) => (prev += curr.text), '').trim() || undefined,
					see,
					access:
						data.flags.isPrivate ||
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						getter.comment?.blockTags?.some((t) => t.tag === '@private' || t.tag === '@internal')
							? 'private'
							: undefined,
					readonly: base.readonly || !hasSetter,
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-nullish-coalescing
					abstract: getter.comment?.blockTags?.some((t) => t.tag === '@abstract') || undefined,
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					deprecated: getter.comment?.blockTags?.some((t) => t.tag === '@deprecated')
						? getter.comment.blockTags
								.find((t) => t.tag === '@deprecated')
								?.content.reduce((prev, curr) => (prev += curr.text), '')
								.trim() ?? true
						: undefined,
					default:
						base.default ??
						(getter.comment?.blockTags
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
							?.find((t) => t.tag === '@default')
							?.content.reduce((prev, curr) => (prev += curr.text), '')
							// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
							.trim() ||
							undefined),
					type: getter.type ? parseType(getter.type) : undefined,
				};
			}

			return base;
		}

		const data = this.data as Member;
		return {
			name: data.name,
			description: data.description,
			see: data.see,
			scope: data.scope,
			access: data.access,
			readonly: data.readonly,
			nullable: data.nullable,
			abstract: data.virtual,
			deprecated: data.deprecated,
			default: data.default,
			type: new DocumentedVarType(data.type, this.config).serialize(),
			props: data.properties?.length
				? data.properties.map((p) => new DocumentedParam(p, this.config).serialize())
				: undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
