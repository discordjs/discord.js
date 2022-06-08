import { DocumentedItem } from './item.js';
import type { VarType } from '../interfaces/index.js';

export class DocumentedVarType extends DocumentedItem<VarType> {
	public override serializer() {
		const names = this.data.names?.map((name) => this.splitVarName(name));

		if (!this.data.description && !this.data.nullable) {
			return names;
		}

		return {
			types: names,
			description: this.data.description,
			nullable: this.data.nullable,
		};
	}

	private splitVarName(str: string) {
		const res: string[][] = [];
		let currGroup: string[] = [];
		let currStr = '';

		const isASymbol = (char: string) => '-!$%^&*()_+|~=`{}[]:;<>?, '.includes(char);

		for (const char of str) {
			const currentlyInASymbolSection = isASymbol(currStr[0]!);
			const charIsASymbol = isASymbol(char);

			if (currStr.length && currentlyInASymbolSection !== charIsASymbol) {
				currGroup.push(currStr);
				currStr = char;

				if (!charIsASymbol) {
					res.push(currGroup);
					currGroup = [];
				}
			} else {
				currStr += char;
			}
		}
		currGroup.push(currStr);
		res.push(currGroup);

		return res;
	}
}
