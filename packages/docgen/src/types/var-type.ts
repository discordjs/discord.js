import type { VarType } from '../interfaces/index.js';
import { parseType } from '../util/parseType.js';
import { splitVarName } from '../util/splitVarName.js';
import { DocumentedItem } from './item.js';

export class DocumentedVarType extends DocumentedItem<VarType> {
	public override serializer() {
		if (this.config.typescript) {
			const data = this.data;
			const names = data.names?.map((name) => splitVarName(parseType(name)));

			if (!data.description && !data.nullable) {
				return names;
			}

			return {
				types: names,
				description: data.description,
				nullable: data.nullable,
			};
		}

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
