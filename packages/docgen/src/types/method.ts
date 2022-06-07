import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';
import type { Method } from '../interfaces/index.js';

export class DocumentedMethod extends DocumentedItem<Method> {
	public override serializer() {
		return {
			name: this.data.name,
			description: this.data.description,
			see: this.data.see,
			scope: this.data.scope,
			access: this.data.access,
			inherits: this.data.inherits,
			inherited: this.data.inherited,
			implements: this.data.implements,
			examples: this.data.examples,
			abstract: this.data.virtual && !this.data.inherited,
			deprecated: this.data.deprecated,
			emits: this.data.fires,
			throws: this.data.exceptions,
			params: this.data.params?.length
				? this.data.params.map((p) => new DocumentedParam(p, this.config).serialize())
				: undefined,
			async: this.data.async,
			generator: this.data.generator,
			returns: this.data.returns?.length
				? this.data.returns.map((p) =>
						new DocumentedVarType(
							{ names: p.type.names, description: p.description, nullable: p.nullable },
							this.config,
						).serialize(),
				  )
				: undefined,
			meta: new DocumentedItemMeta(this.data.meta, this.config).serialize(),
		};
	}
}
