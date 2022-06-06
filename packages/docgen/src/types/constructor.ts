import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import type { Constructor } from '../interfaces/index.js';

export class DocumentedConstructor extends DocumentedItem<Constructor> {
	public override serializer() {
		return {
			name: this.data.name,
			description: this.data.description,
			see: this.data.see,
			access: this.data.access,
			params: this.data.params?.length
				? this.data.params.map((p) => new DocumentedParam(p, this.config).serialize())
				: undefined,
		};
	}
}
