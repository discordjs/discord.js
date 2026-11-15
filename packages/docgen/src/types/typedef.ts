import type { Typedef } from '../interfaces/index.js';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';

export class DocumentedTypeDef extends DocumentedItem<Typedef> {
	public override serializer() {
		const data = this.data;
		return {
			name: data.name,
			description: data.description,
			see: data.see,
			access: data.access,
			deprecated: data.deprecated,
			type: new DocumentedVarType(data.type, this.config).serialize(),
			props: data.properties?.length
				? data.properties.map((prop) => new DocumentedParam(prop, this.config).serialize())
				: undefined,
			params: data.params?.length
				? data.params.map((param) => new DocumentedParam(param, this.config).serialize())
				: undefined,
			returns: data.returns?.length
				? data.returns.map((prop) => new DocumentedVarType(prop, this.config).serialize())
				: undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
