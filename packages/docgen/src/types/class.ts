import { Collection } from '@discordjs/collection';
import { DocumentedConstructor } from './constructor.js';
import { DocumentedEvent } from './event.js';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedMember } from './member.js';
import { DocumentedMethod } from './method.js';
import { DocumentedVarType } from './var-type.js';
import type { Class, Config } from '../interfaces/index.js';

export class DocumentedClass extends DocumentedItem<Class> {
	public readonly props = new Collection<string, DocumentedMember>();

	public readonly methods = new Collection<string, DocumentedMethod>();

	public readonly events = new Collection<string, DocumentedEvent>();

	public construct: DocumentedConstructor | null = null;

	public extends: DocumentedVarType | null = null;

	public implements: DocumentedVarType | null = null;

	public constructor(data: Class, config: Config) {
		super(data, config);

		if (data.augments) {
			this.extends = new DocumentedVarType({ names: data.augments }, this.config);
		}

		if (data.implements) {
			this.implements = new DocumentedVarType({ names: data.implements }, this.config);
		}
	}

	public add(item: DocumentedConstructor | DocumentedMethod | DocumentedMember | DocumentedEvent) {
		if (item instanceof DocumentedConstructor) {
			if (this.construct) throw new Error(`Doc ${this.data.name} already has constructor`);
			this.construct = item;
		} else if (item instanceof DocumentedMethod) {
			const prefix = item.data.scope === 'static' ? 's-' : '';
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
		return {
			name: this.data.name,
			description: this.data.description,
			see: this.data.see,
			extends: this.extends?.serialize(),
			implements: this.implements?.serialize(),
			access: this.data.access,
			abstract: this.data.virtual,
			deprecated: this.data.deprecated,
			construct: this.construct?.serialize(),
			props: this.props.size ? this.props.map((p) => p.serialize()) : undefined,
			methods: this.methods.size ? this.methods.map((m) => m.serialize()) : undefined,
			events: this.events.size ? this.events.map((e) => e.serialize()) : undefined,
			meta: new DocumentedItemMeta(this.data.meta, this.config).serialize(),
		};
	}
}
