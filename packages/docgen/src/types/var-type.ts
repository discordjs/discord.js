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
		if (str === '*') return ['*'];
		str = str.replace(/\./g, '');
		const matches = str.match(/([\w*]+)([^\w*]+)/g);
		const output = [];
		if (matches) {
			for (const match of matches) {
				const groups = /([\w*]+)([^\w*]+)/.exec(match);
				output.push([groups![1], groups![2]]);
			}
		} else {
			output.push([str.match(/([\w*]+)/g)![0]]);
		}
		return output;
	}
}
