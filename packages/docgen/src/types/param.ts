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
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-nullish-coalescing
				description: data.comment?.summary?.reduce((prev, curr) => (prev += curr.text), '').trim() || undefined,
				optional: data.flags.isOptional || typeof data.defaultValue != 'undefined',
				default:
					(data.defaultValue === '...' ? undefined : data.defaultValue) ??
					(data.comment?.blockTags
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						?.find((t) => t.tag === '@default')
						?.content.reduce((prev, curr) => (prev += curr.text), '')
						// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
						.trim() ||
						undefined),
				variable: data.flags.isRest,
				type: data.type ? new DocumentedVarType({ names: [parseType(data.type)] }, this.config).serialize() : undefined,
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
