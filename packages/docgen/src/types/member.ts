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
			let meta;

			const sources = data.sources?.[0];
			if (sources) {
				meta = new DocumentedItemMeta(sources, this.config).serialize();
			}

			const base = {
				name: data.name,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				description: data.comment?.shortText?.trim(),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				see: data.comment?.tags?.filter((t) => t.tagName === 'see').map((t) => t.text.trim()),
				scope: data.flags.isStatic ? 'static' : undefined,
				access:
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					data.flags.isPrivate || data.comment?.tags?.some((t) => t.tagName === 'private' || t.tagName === 'internal')
						? 'private'
						: undefined,
				readonly: data.flags.isReadonly,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				abstract: data.comment?.tags?.some((t) => t.tagName === 'abstract'),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				deprecated: data.comment?.tags?.some((t) => t.tagName === 'deprecated'),
				default:
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					data.comment?.tags?.find((t) => t.tagName === 'default')?.text.trim() ??
					(data.defaultValue === '...' ? undefined : data.defaultValue),
				type: data.type ? new DocumentedVarType({ names: [parseType(data.type)] }, this.config).serialize() : undefined,
				meta,
			};

			if (data.kindString === 'Accessor') {
				const getter = data.getSignature;
				const hasSetter = data.setSignature;

				if (!getter) {
					throw new Error("Can't parse accessor without getter.");
				}

				if (!hasSetter) base.readonly = true;

				return {
					...base,
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					description: getter.comment?.shortText?.trim(),
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					see: getter.comment?.tags?.filter((t) => t.tagName === 'see').map((t) => t.text.trim()),
					access:
						getter.flags.isPrivate ||
						getter.comment?.tags.some((t) => t.tagName === 'private' || t.tagName === 'internal')
							? 'private'
							: undefined,
					readonly: base.readonly || !hasSetter,
					abstract: getter.comment?.tags.some((t) => t.tagName === 'abstract'),
					deprecated: getter.comment?.tags.some((t) => t.tagName === 'deprecated'),
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					default:
						base.default ??
						getter.comment?.tags.find((t) => t.tagName === 'default')?.text.trim() ??
						// @ts-expect-error
						getter.defaultValue,
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

/*
{ id: 'Client#rest',
  longname: 'Client#rest',
  name: 'rest',
  scope: 'instance',
  kind: 'member',
  description: 'The REST manager of the client',
  memberof: 'Client',
  type: { names: [ 'RESTManager' ] },
  access: 'private',
  meta:
   { lineno: 32,
     filename: 'Client.js',
     path: 'src/client' },
  order: 11 }
*/
