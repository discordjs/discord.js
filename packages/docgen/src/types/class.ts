import { parse } from 'node:path';
import type { DeclarationReflection } from 'typedoc';
import type { Class, Config } from '../interfaces/index.js';
import { parseType } from '../util/parseType.js';
import { DocumentedConstructor } from './constructor.js';
import { DocumentedEvent } from './event.js';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedMember } from './member.js';
import { DocumentedMethod } from './method.js';
import { DocumentedVarType } from './var-type.js';

export class DocumentedClass extends DocumentedItem<Class | DeclarationReflection> {
	public readonly props = new Map<string, DocumentedMember>();

	public readonly methods = new Map<string, DocumentedMethod>();

	public readonly events = new Map<string, DocumentedEvent>();

	public construct: DocumentedConstructor | null = null;

	public extends: DocumentedVarType | null = null;

	public implements: DocumentedVarType | null = null;

	public constructor(data: Class | DeclarationReflection, config: Config) {
		super(data, config);

		if (config.typescript) {
			const newData = data as DeclarationReflection;
			const extended = newData.extendedTypes?.[0];
			if (extended) {
				this.extends = new DocumentedVarType({ names: [parseType(extended)] }, this.config);
			}

			const implemented = newData.implementedTypes?.[0];
			if (implemented) {
				this.implements = new DocumentedVarType({ names: [parseType(implemented)] }, this.config);
			}
		} else {
			const newData = data as Class;
			if (newData.augments) {
				this.extends = new DocumentedVarType({ names: newData.augments }, this.config);
			}

			if (newData.implements) {
				this.implements = new DocumentedVarType({ names: newData.implements }, this.config);
			}
		}
	}

	public add(item: DocumentedConstructor | DocumentedEvent | DocumentedMember | DocumentedMethod) {
		if (item instanceof DocumentedConstructor) {
			if (this.construct) {
				throw new Error(`Doc ${this.data.name} already has constructor`);
			}

			this.construct = item;
		} else if (item instanceof DocumentedMethod) {
			// @ts-expect-error no type for methods
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
			const signature = (data.signatures ?? [])[0] ?? data;
			let meta;

			const sources = data.sources?.[0];
			if (sources) {
				meta = new DocumentedItemMeta(sources, this.config).serialize();
			}

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const see = signature.comment?.blockTags?.filter((block) => block.tag === '@see').length
				? signature.comment.blockTags
						.filter((block) => block.tag === '@see')
						.map((block) => block.content.find((contentText) => contentText.kind === 'text')?.text.trim())
				: undefined;

			return {
				// @ts-expect-error type cannot be inferred
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				name: signature.name === 'default' ? parse(meta?.file ?? 'default').name : signature.name,
				// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, no-param-reassign
				description: signature.comment?.summary.reduce((prev, curr) => (prev += curr.text), '').trim() || undefined,
				see,
				extends: this.extends?.serialize(),
				implements: this.implements?.serialize(),
				access:
					data.flags.isPrivate ||
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					signature.comment?.blockTags?.some((block) => block.tag === '@private' || block.tag === '@internal')
						? 'private'
						: undefined,
				// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unnecessary-condition
				abstract: signature.comment?.blockTags?.some((block) => block.tag === '@abstract') || undefined,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				deprecated: signature.comment?.blockTags?.some((block) => block.tag === '@deprecated')
					? signature.comment.blockTags
							.find((block) => block.tag === '@deprecated')
							// eslint-disable-next-line no-param-reassign
							?.content.reduce((prev, curr) => (prev += curr.text), '')
							.trim() ?? true
					: undefined,
				construct: this.construct?.serialize(),
				props: this.props.size ? [...this.props.values()].map((param) => param.serialize()) : undefined,
				methods: this.methods.size ? [...this.methods.values()].map((method) => method.serialize()) : undefined,
				events: this.events.size ? [...this.events.values()].map((event) => event.serialize()) : undefined,
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
			props: this.props.size ? [...this.props.values()].map((param) => param.serialize()) : undefined,
			methods: this.methods.size ? [...this.methods.values()].map((method) => method.serialize()) : undefined,
			events: this.events.size ? [...this.events.values()].map((event) => event.serialize()) : undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
