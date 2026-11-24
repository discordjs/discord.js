import type { Method } from '../interfaces/index.js';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';

export class DocumentedMethod extends DocumentedItem<Method> {
	public override serializer() {
		const data = this.data;
		return {
			name: data.name,
			description: data.description,
			see: data.see,
			scope: data.scope,
			access: data.access,
			inherits: data.inherits,
			inherited: data.inherited,
			implements: data.implements,
			examples: data.examples,
			abstract: data.virtual && !data.inherited,
			deprecated: data.deprecated,
			emits: data.fires,
			throws: data.exceptions,
			params: data.params?.length
				? data.params.map((param) => new DocumentedParam(param, this.config).serialize())
				: undefined,
			async: data.async,
			generator: data.generator,
			returns: data.returns?.length
				? data.returns.map((param) =>
						new DocumentedVarType(
							{ names: param.type.names, description: param.description, nullable: param.nullable },
							this.config,
						).serialize(),
					)
				: undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
