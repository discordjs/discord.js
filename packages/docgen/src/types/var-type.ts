import type { VarType } from '../interfaces/index.js';
import { splitVarName } from '../util/splitVarName.js';
import { DocumentedItem } from './item.js';

export class DocumentedVarType extends DocumentedItem<VarType> {
	public override serializer() {
		const data = this.data;
		const names = (data.names ?? data.type?.names)?.map((name) => splitVarName(name));

		if (!data.description && !data.nullable) {
			return names;
		}

		return {
			types: names,
			description: data.description,
			nullable: data.nullable,
		};
	}
}
