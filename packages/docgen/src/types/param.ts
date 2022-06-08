import type { ParameterReflection } from 'typedoc';
import { DocumentedItem } from './item.js';
import { DocumentedVarType } from './var-type.js';
import type { Param } from '../interfaces/index.js';
import { parseType } from '../util/parseType.js';

export class DocumentedParam extends DocumentedItem<Param | ParameterReflection> {
	public override serializer() {
		if (this.config.typescript) {
			const data = this.data as ParameterReflection;

			return {
				name: data.name,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				description: data.comment?.shortText?.trim() ?? data.comment?.text.trim(),
				optional: data.flags.isOptional || typeof data.defaultValue != 'undefined',
				default:
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					data.comment?.tags?.find((t) => t.tagName === 'default')?.text.trim() ??
					(data.defaultValue === '...' ? undefined : data.defaultValue),
				type: data.type ? new DocumentedVarType({ names: [parseType(data.type)] }, this.config).serialize() : undefined,
				variable: data.flags.isRest,
			};
		}

		const data = this.data as Param;
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
