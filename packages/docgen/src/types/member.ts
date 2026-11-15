import type { Member } from '../interfaces/index.js';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';

export class DocumentedMember extends DocumentedItem<Member> {
	public override serializer() {
		const data = this.data;
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
