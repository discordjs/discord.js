import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';
import type { Typedef } from '../interfaces/index.js';

export class DocumentedTypeDef extends DocumentedItem<Typedef> {
	public override serializer() {
		return {
			name: this.data.name,
			description: this.data.description,
			see: this.data.see,
			access: this.data.access,
			deprecated: this.data.deprecated,
			type: new DocumentedVarType(this.data.type, this.config).serialize(),
			props: this.data.properties?.length
				? this.data.properties.map((p) => new DocumentedParam(p, this.config).serialize())
				: undefined,
			params: this.data.params?.length
				? this.data.params.map((p) => new DocumentedParam(p, this.config).serialize())
				: undefined,
			returns: this.data.returns?.length
				? this.data.returns.map((p) => new DocumentedVarType(p, this.config).serialize())
				: undefined,
			meta: new DocumentedItemMeta(this.data.meta, this.config).serialize(),
		};
	}
}
