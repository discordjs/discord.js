import type { Param } from '../interfaces/index.js';
import { DocumentedItem } from './item.js';
import { DocumentedVarType } from './var-type.js';

export class DocumentedParam extends DocumentedItem<Param> {
	public override serializer() {
		const data = this.data;
		return {
			name: data.name,
			description: data.description,
			optional: data.optional,
			default: data.defaultvalue,
			variable: data.variable,
			nullable: data.nullable,
			type: new DocumentedVarType(data.type, this.config).serialize(),
		};
	}
}
