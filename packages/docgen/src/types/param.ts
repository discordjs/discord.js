import { DocumentedItem } from './item.js';
import { DocumentedVarType } from './var-type.js';
import type { Param } from '../interfaces/index.js';

export class DocumentedParam extends DocumentedItem<Param> {
	public override serializer() {
		return {
			name: this.data.name,
			description: this.data.description,
			optional: this.data.optional,
			default: this.data.defaultvalue,
			variable: this.data.variable,
			nullable: this.data.nullable,
			type: new DocumentedVarType(this.data.type, this.config).serialize(),
		};
	}
}
