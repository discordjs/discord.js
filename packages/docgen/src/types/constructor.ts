import type { Constructor } from '../interfaces/index.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';

export class DocumentedConstructor extends DocumentedItem<Constructor> {
	public override serializer() {
		const data = this.data;
		return {
			name: data.name,
			description: data.description,
			see: data.see,
			access: data.access,
			params: data.params?.length
				? data.params.map((param) => new DocumentedParam(param, this.config).serialize())
				: undefined,
		};
	}
}
