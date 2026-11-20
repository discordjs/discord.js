import type { Class, Config } from '../interfaces/index.js';
import { DocumentedConstructor } from './constructor.js';
import { DocumentedEvent } from './event.js';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedMember } from './member.js';
import { DocumentedMethod } from './method.js';
import { DocumentedVarType } from './var-type.js';

export class DocumentedClass extends DocumentedItem<Class> {
	public readonly props = new Map<string, DocumentedMember>();

	public readonly methods = new Map<string, DocumentedMethod>();

	public readonly events = new Map<string, DocumentedEvent>();

	public construct: DocumentedConstructor | null = null;

	public extends: DocumentedVarType | null = null;

	public implements: DocumentedVarType | null = null;

	public constructor(data: Class, config: Config) {
		super(data, config);

		const newData = data;
		if (newData.augments) {
			this.extends = new DocumentedVarType({ names: newData.augments }, this.config);
		}

		if (newData.implements) {
			this.implements = new DocumentedVarType({ names: newData.implements }, this.config);
		}
	}

	public add(item: DocumentedConstructor | DocumentedEvent | DocumentedMember | DocumentedMethod) {
		if (item instanceof DocumentedConstructor) {
			if (this.construct) {
				throw new Error(`Doc ${this.data.name} already has constructor`);
			}

			this.construct = item;
		} else if (item instanceof DocumentedMethod) {
			// @ts-expect-error: No type for methods
			const prefix = item.data.scope === 'static' || item.data.flags?.isStatic ? 's-' : '';
			if (this.methods.has(prefix + item.data.name)) {
				throw new Error(`Doc ${this.data.name} already has method ${item.data.name}`);
			}

			this.methods.set(prefix + item.data.name, item);
		} else if (item instanceof DocumentedMember) {
			if (this.props.has(item.data.name)) {
				throw new Error(`Doc ${this.data.name} already has prop ${item.data.name}`);
			}

			this.props.set(item.data.name, item);
		} else if (item instanceof DocumentedEvent) {
			if (this.events.has(item.data.name)) {
				throw new Error(`Doc ${this.data.name} already has event ${item.data.name}`);
			}

			this.events.set(item.data.name, item);
		}
	}

	public override serializer() {
		const data = this.data;
		return {
			name: data.name,
			description: data.description,
			see: data.see,
			extends: this.extends?.serialize(),
			implements: this.implements?.serialize(),
			access: data.access,
			abstract: data.virtual,
			deprecated: data.deprecated,
			construct: this.construct?.serialize(),
			props: this.props.size ? [...this.props.values()].map((param) => param.serialize()) : undefined,
			methods: this.methods.size ? [...this.methods.values()].map((method) => method.serialize()) : undefined,
			events: this.events.size ? [...this.events.values()].map((event) => event.serialize()) : undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
