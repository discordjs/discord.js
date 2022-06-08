import type { DeclarationReflection } from 'typedoc';
import { DocumentedItemMeta } from './item-meta.js';
import { DocumentedItem } from './item.js';
import { DocumentedParam } from './param.js';
import { DocumentedVarType } from './var-type.js';
import type { Typedef } from '../interfaces/index.js';
import { parseType } from '../util/parseType.js';
import { isReflectionType } from '../util/types.js';

export class DocumentedTypeDef extends DocumentedItem<Typedef | DeclarationReflection> {
	public override serializer() {
		if (this.config.typescript) {
			const data = this.data as DeclarationReflection;
			let meta;

			const sources = data.sources?.[0];
			if (sources) {
				meta = new DocumentedItemMeta(sources, this.config).serialize();
			}

			const baseReturn = {
				name: data.name,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				description: data.comment?.shortText?.trim(),
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				see: data.comment?.tags?.filter((t) => t.tagName === 'see').map((t) => t.text.trim()),
				access:
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					data.flags.isPrivate || data.comment?.tags?.some((t) => t.tagName === 'private' || t.tagName === 'internal')
						? 'private'
						: undefined,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				deprecated: data.comment?.tags?.some((t) => t.tagName === 'deprecated'),
				type: data.type ? new DocumentedVarType({ names: [parseType(data.type)] }, this.config).serialize() : undefined,
				meta,
			};

			let typeDef: DeclarationReflection | undefined;
			if (isReflectionType(data.type)) {
				typeDef = data.type.declaration;
			} else if (data.kindString === 'Interface') {
				typeDef = data;
			} else if (data.kindString === 'Enumeration') {
				return {
					...baseReturn,
					props: data.children?.length
						? data.children.map((child) => ({
								name: child.name,
								description: child.comment?.shortText.trim(),
								type: typeof child.defaultValue == 'undefined' ? undefined : [[[child.defaultValue]]],
						  }))
						: undefined,
				};
			}

			if (typeDef) {
				const { children, signatures } = typeDef;

				if (children && children.length > 0) {
					const props = children.map((child) => ({
						name: child.name,
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						description: child.comment?.shortText?.trim() ?? child.signatures?.[0]?.comment?.shortText?.trim(),
						optional: child.flags.isOptional || typeof child.defaultValue != 'undefined',
						default:
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
							child.comment?.tags?.find((t) => t.tagName === 'default')?.text.trim() ??
							(child.defaultValue === '...' ? undefined : child.defaultValue),
						type: child.type
							? new DocumentedVarType({ names: [parseType(child.type)] }, this.config).serialize()
							: child.kindString === 'Method'
							? new DocumentedVarType(
									{
										names: [
											parseType({
												type: 'reflection',
												declaration: child,
											}),
										],
									},
									this.config,
							  ).serialize()
							: undefined,
					}));

					return {
						...baseReturn,
						props,
					};
				}

				if (signatures && signatures.length > 0) {
					const sig = signatures[0];

					const params = sig?.parameters?.map((param) => ({
						name: param.name,
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						description: param.comment?.shortText?.trim(),
						optional: param.flags.isOptional || typeof param.defaultValue != 'undefined',
						default:
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
							param.comment?.tags?.find((t) => t.tagName === 'default')?.text.trim() ??
							(param.defaultValue === '...' ? undefined : param.defaultValue),
						type: param.type
							? new DocumentedVarType({ names: [parseType(param.type)] }, this.config).serialize()
							: undefined,
					}));

					return {
						...baseReturn,
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						description: sig?.comment?.shortText?.trim(),
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						see: sig?.comment?.tags?.filter((t) => t.tagName === 'see').map((t) => t.text.trim()),
						access:
							sig?.flags.isPrivate ||
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
							sig?.comment?.tags?.some((t) => t.tagName === 'private' || t.tagName === 'internal')
								? 'private'
								: undefined,
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						deprecated: sig?.comment?.tags?.some((t) => t.tagName === 'deprecated'),
						params,
						returns: sig?.type
							? new DocumentedVarType(
									{ names: [parseType(sig.type)], description: sig.comment?.returns?.trim() },
									this.config,
							  ).serialize()
							: undefined,
						returnsDescription: sig?.comment?.returns?.trim(),
					};
				}
			}

			return baseReturn;
		}

		const data = this.data as Typedef;
		return {
			name: data.name,
			description: data.description,
			see: data.see,
			access: data.access,
			deprecated: data.deprecated,
			type: new DocumentedVarType(data.type, this.config).serialize(),
			props: data.properties?.length
				? data.properties.map((p) => new DocumentedParam(p, this.config).serialize())
				: undefined,
			params: data.params?.length ? data.params.map((p) => new DocumentedParam(p, this.config).serialize()) : undefined,
			returns: data.returns?.length
				? data.returns.map((p) => new DocumentedVarType(p, this.config).serialize())
				: undefined,
			meta: new DocumentedItemMeta(data.meta, this.config).serialize(),
		};
	}
}
