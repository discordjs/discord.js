import type { DeclarationReflection } from 'typedoc';
import type { Member } from '../interfaces/index.js';
import { parseType } from '../util/parseType.js';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';

export class DocumentedMember extends DocumentedItem<DeclarationReflection | Member> {
	public override serializer() {
		if (this.config.typescript) {
			const data = this.data as DeclarationReflection;
			const signature = (data.signatures ?? [])[0] ?? data;
			let meta;

			const sources = data.sources?.[0];
			if (sources) {
				meta = new DocumentedItemMeta(sources, this.config).serialize();
			}

			const see = signature.comment?.blockTags?.filter((block) => block.tag === '@see').length
				? signature.comment.blockTags
						.filter((block) => block.tag === '@see')
						.map((block) => block.content.find((contentText) => contentText.kind === 'text')?.text.trim())
				: undefined;

			const base = {
				name: signature.name,
				// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, no-param-reassign
				description: signature.comment?.summary?.reduce((prev, curr) => (prev += curr.text), '').trim() || undefined,
				see,
				scope: data.flags.isStatic ? 'static' : undefined,
				access:
					data.flags.isPrivate ||
					signature.comment?.blockTags?.some((block) => block.tag === '@private' || block.tag === '@internal')
						? 'private'
						: undefined,
				readonly: data.flags.isReadonly,
				// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
				abstract: signature.comment?.blockTags?.some((block) => block.tag === '@abstract') || undefined,
				deprecated: signature.comment?.blockTags?.some((block) => block.tag === '@deprecated')
					? signature.comment.blockTags
							.find((block) => block.tag === '@deprecated')
							// eslint-disable-next-line no-param-reassign
							?.content.reduce((prev, curr) => (prev += curr.text), '')
							.trim() ?? true
					: undefined,
				default:
					(data.defaultValue === '...' ? undefined : data.defaultValue) ??
					(signature.comment?.blockTags
						?.find((block) => block.tag === '@default')
						// eslint-disable-next-line no-param-reassign
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

				const see = getter.comment?.blockTags?.filter((block) => block.tag === '@see').length
					? getter.comment.blockTags
							.filter((block) => block.tag === '@see')
							.map((block) => block.content.find((contentText) => contentText.kind === 'text')?.text.trim())
					: undefined;

				return {
					...base,
					// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, no-param-reassign
					description: getter.comment?.summary?.reduce((prev, curr) => (prev += curr.text), '').trim() || undefined,
					see,
					access:
						data.flags.isPrivate ||
						getter.comment?.blockTags?.some((block) => block.tag === '@private' || block.tag === '@internal')
							? 'private'
							: undefined,
					readonly: base.readonly || !hasSetter,
					// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
					abstract: getter.comment?.blockTags?.some((block) => block.tag === '@abstract') || undefined,
					deprecated: getter.comment?.blockTags?.some((block) => block.tag === '@deprecated')
						? getter.comment.blockTags
								.find((block) => block.tag === '@deprecated')
								// eslint-disable-next-line no-param-reassign
								?.content.reduce((prev, curr) => (prev += curr.text), '')
								.trim() ?? true
						: undefined,
					default:
						base.default ??
						(getter.comment?.blockTags
							?.find((block) => block.tag === '@default')
							// eslint-disable-next-line no-param-reassign
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
				? data.properties.map((prop) => new DocumentedParam(prop, this.config).serialize())
				: undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
