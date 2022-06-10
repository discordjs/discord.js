import { dirname, join, relative } from 'node:path';
import { Collection } from '@discordjs/collection';
import type { DeclarationReflection } from 'typedoc';
import type { ChildTypes, Class, Config, CustomDocs, RootTypes } from './interfaces/index.js';
import { DocumentedClass } from './types/class.js';
import { DocumentedConstructor } from './types/constructor.js';
import { DocumentedEvent } from './types/event.js';
import { DocumentedExternal } from './types/external.js';
import { DocumentedInterface } from './types/interface.js';
import { DocumentedMember } from './types/member.js';
import { DocumentedMethod } from './types/method.js';
import { DocumentedTypeDef } from './types/typedef.js';
import packageFile from '../package.json';

export class Documentation {
	public readonly classes = new Collection<string, DocumentedClass>();

	public readonly functions = new Collection<string, DocumentedMethod>();

	public readonly interfaces = new Collection<string, DocumentedInterface>();

	public readonly typedefs = new Collection<string, DocumentedTypeDef>();

	public readonly externals = new Collection<string, DocumentedExternal>();

	public constructor(
		data: RootTypes[] | DeclarationReflection[],
		private readonly config: Config,
		private readonly custom?: Record<string, CustomDocs>,
	) {
		if (config.typescript) {
			const items = data as DeclarationReflection[];

			for (const item of items) {
				switch (item.kindString) {
					case 'Class': {
						this.classes.set(item.name, new DocumentedClass(item, config));
						if (item.children) {
							this.parse(item.children, item.name);
						}
						break;
					}

					case 'Function': {
						this.functions.set(item.name, new DocumentedMethod(item, config));
						break;
					}

					case 'Interface':
					case 'Type alias':
					case 'Enumeration':
						this.typedefs.set(item.name, new DocumentedTypeDef(item, config));
						if (item.children) {
							this.parse(item.children, item.name);
						}
						break;

					default:
						break;
				}
			}
		} else {
			let items = data as RootTypes[];
			items = items.filter((i) => !i.ignore);

			for (const item of items) {
				switch (item.kind) {
					case 'class': {
						this.classes.set(item.name, new DocumentedClass(item, config));
						items = items.filter((i) => i.longname !== item.longname || i.kind !== item.kind);
						break;
					}
					case 'function': {
						if (item.scope === 'global' || !item.memberof) {
							this.functions.set(item.name, new DocumentedMethod(item, config));
							items = items.filter((i) => i.longname !== item.longname);
						}
						break;
					}
					case 'interface': {
						this.interfaces.set(item.name, new DocumentedInterface(item as unknown as Class, config));
						items = items.filter((i) => i.longname !== item.longname);
						break;
					}
					case 'typedef': {
						this.typedefs.set(item.name, new DocumentedTypeDef(item, config));
						items = items.filter((i) => i.longname !== item.longname);
						break;
					}
					case 'external': {
						this.externals.set(item.name, new DocumentedExternal(item, config));
						items = items.filter((i) => i.longname !== item.longname);
						break;
					}
					default:
						break;
				}
			}

			this.parse(items as ChildTypes[]);
		}
	}

	public parse(items: ChildTypes[] | DeclarationReflection[], memberOf = '') {
		if (this.config.typescript) {
			const it = items as DeclarationReflection[];

			for (const member of it) {
				let item: DocumentedMethod | DocumentedConstructor | DocumentedMember | DocumentedEvent | null = null;

				switch (member.kindString) {
					case 'Constructor': {
						item = new DocumentedConstructor(member, this.config);
						break;
					}
					case 'Method': {
						item = new DocumentedMethod(member, this.config);
						break;
					}
					case 'Property': {
						item = new DocumentedMember(member, this.config);
						break;
					}
					case 'Event': {
						item = new DocumentedEvent(member, this.config);
						break;
					}
					default: {
						// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
						console.warn(`- Unknown documentation kind "${member.kindString}" - \n${JSON.stringify(member)}\n`);
					}
				}

				const parent = this.classes.get(memberOf) ?? this.interfaces.get(memberOf);
				if (parent) {
					if (item) {
						parent.add(item);
					} else {
						console.warn(
							`- Documentation item could not be constructed for "${member.name}" - \n${JSON.stringify(member)}\n`,
						);
					}
					continue;
				}

				const info = [];
				const name = (member.name || item?.data.name) ?? 'UNKNOWN';
				const meta =
					member.kindString === 'constructor'
						? null
						: {
								file: member.sources?.[0]?.fileName,
								line: member.sources?.[0]?.line,
								path: dirname(member.sources?.[0]?.fileName ?? ''),
						  };

				if (memberOf) {
					info.push(`member of "${memberOf}"`);
				}
				if (meta) {
					info.push(
						`${relative(this.config.root, join(meta.path, meta.file ?? ''))}${meta.line ? `:${meta.line}` : ''}`,
					);
				}

				console.warn(`- "${name}"${info.length ? ` (${info.join(', ')})` : ''} has no accessible parent.`);
				if (!name && !info.length) {
					console.warn('Raw object:', member);
				}
			}
		} else {
			const it = items as ChildTypes[];

			for (const member of it) {
				let item: DocumentedMethod | DocumentedConstructor | DocumentedMember | DocumentedEvent | null = null;

				switch (member.kind) {
					case 'constructor': {
						item = new DocumentedConstructor(member, this.config);
						break;
					}
					case 'function': {
						item = new DocumentedMethod(member, this.config);
						break;
					}
					case 'member': {
						item = new DocumentedMember(member, this.config);
						break;
					}
					case 'event': {
						item = new DocumentedEvent(member, this.config);
						break;
					}
					default: {
						// @ts-expect-error
						// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
						console.warn(`- Unknown documentation kind "${member.kind}" - \n${JSON.stringify(member)}\n`);
					}
				}

				const parent = this.classes.get(member.memberof ?? '') ?? this.interfaces.get(member.memberof ?? '');
				if (parent) {
					if (item) {
						parent.add(item);
					} else {
						console.warn(
							`- Documentation item could not be constructed for "${member.name}" - \n${JSON.stringify(member)}\n`,
						);
					}
					continue;
				}

				const info = [];
				const name = (member.name || item?.data.name) ?? 'UNKNOWN';
				// @ts-expect-error
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-condition
				const memberof = member.memberof ?? item?.data?.memberof;
				const meta =
					member.kind === 'constructor'
						? null
						: { file: member.meta.filename, line: member.meta.lineno, path: member.meta.path };

				if (memberof) {
					info.push(`member of "${memberof as string}"`);
				}
				if (meta) {
					info.push(`${relative(this.config.root, join(meta.path, meta.file))}${meta.line ? `:${meta.line}` : ''}`);
				}

				console.warn(`- "${name}"${info.length ? ` (${info.join(', ')})` : ''} has no accessible parent.`);
				if (!name && !info.length) {
					console.warn('Raw object:', member);
				}
			}
		}
	}

	public serialize() {
		return {
			meta: {
				generator: packageFile.version,
				format: Documentation.FORMAT_VERSION,
				date: Date.now(),
			},
			classes: this.classes.map((c) => c.serialize()),
			functions: this.functions.map((f) => f.serialize()),
			interfaces: this.interfaces.map((i) => i.serialize()),
			typedefs: this.typedefs.map((t) => t.serialize()),
			externals: this.externals.map((e) => e.serialize()),
			custom: this.custom,
		};
	}

	public static get FORMAT_VERSION() {
		return 30;
	}
}
