import { parse } from 'node:path';
import { Collection } from '@discordjs/collection';
import type { DeclarationReflection } from 'typedoc';
import { DocumentedConstructor } from './constructor.js';
import { DocumentedEvent } from './event.js';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedMember } from './member.js';
import { DocumentedMethod } from './method.js';
import { DocumentedVarType } from './var-type.js';
import type { Class, Config } from '../interfaces/index.js';
import { parseType } from '../util/parseType.js';

export class DocumentedClass extends DocumentedItem<Class | DeclarationReflection> {
	public readonly props = new Collection<string, DocumentedMember>();

	public readonly methods = new Collection<string, DocumentedMethod>();

	public readonly events = new Collection<string, DocumentedEvent>();

	public construct: DocumentedConstructor | null = null;

	public extends: DocumentedVarType | null = null;

	public implements: DocumentedVarType | null = null;

	public constructor(data: Class | DeclarationReflection, config: Config) {
		super(data, config);

		if (config.typescript) {
			const d = data as DeclarationReflection;
			const extended = d.extendedTypes?.[0];
			if (extended) {
				this.extends = new DocumentedVarType({ names: [parseType(extended)] }, this.config);
			}

			const implemented = d.implementedTypes?.[0];
			if (implemented) {
				this.implements = new DocumentedVarType({ names: [parseType(implemented)] }, this.config);
			}
		} else {
			const d = data as Class;
			if (d.augments) {
				this.extends = new DocumentedVarType({ names: d.augments }, this.config);
			}

			if (d.implements) {
				this.implements = new DocumentedVarType({ names: d.implements }, this.config);
			}
		}
	}

	public add(item: DocumentedConstructor | DocumentedMethod | DocumentedMember | DocumentedEvent) {
		if (item instanceof DocumentedConstructor) {
			if (this.construct) throw new Error(`Doc ${this.data.name} already has constructor`);
			this.construct = item;
		} else if (item instanceof DocumentedMethod) {
			// @ts-expect-error
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
		if (this.config.typescript) {
			const data = this.data as DeclarationReflection;
			let meta;

			const sources = data.sources?.[0];
			if (sources) {
				meta = new DocumentedItemMeta(sources, this.config).serialize();
			}

			return {
				// @ts-expect-error
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				name: data.name === 'default' ? parse(meta?.file ?? 'default').name : data.name,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				description: data.comment?.shortText?.trim(),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				see: data.comment?.tags?.filter((t) => t.tagName === 'see').map((t) => t.text.trim()),
				extends: this.extends?.serialize(),
				implements: this.implements?.serialize(),
				access:
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					data.flags.isPrivate || data.comment?.tags?.some((t) => t.tagName === 'private' || t.tagName === 'internal')
						? 'private'
						: undefined,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				abstract: data.comment?.tags?.some((t) => t.tagName === 'abstract'),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				deprecated: data.comment?.tags?.some((t) => t.tagName === 'deprecated'),
				construct: this.construct?.serialize(),
				props: this.props.size ? this.props.map((p) => p.serialize()) : undefined,
				methods: this.methods.size ? this.methods.map((m) => m.serialize()) : undefined,
				events: this.events.size ? this.events.map((e) => e.serialize()) : undefined,
				meta,
			};
		}

		const data = this.data as Class;
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
			props: this.props.size ? this.props.map((p) => p.serialize()) : undefined,
			methods: this.methods.size ? this.methods.map((m) => m.serialize()) : undefined,
			events: this.events.size ? this.events.map((e) => e.serialize()) : undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
