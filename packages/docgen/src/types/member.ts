import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';
import type { Member } from '../interfaces/index.js';

export class DocumentedMember extends DocumentedItem<Member> {
	public override serializer() {
		return {
			name: this.data.name,
			description: this.data.description,
			see: this.data.see,
			scope: this.data.scope,
			access: this.data.access,
			readonly: this.data.readonly,
			nullable: this.data.nullable,
			abstract: this.data.virtual,
			deprecated: this.data.deprecated,
			default: this.data.default,
			type: new DocumentedVarType(this.data.type, this.config).serialize(),
			props: this.data.properties?.length
				? this.data.properties.map((p) => new DocumentedParam(p, this.config).serialize())
				: undefined,
			meta: new DocumentedItemMeta(this.data.meta, this.config).serialize(),
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
