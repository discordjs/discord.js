import type { APIBaseComponent, APIMessageComponent, APIModalComponent, ComponentType } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * The data stored by a {@link Component} structure based on its {@link (Component:class)."type"} property.
 */
export type ComponentDataType<Type extends ComponentType | 'unknown'> = Type extends ComponentType
	? Extract<APIMessageComponent | APIModalComponent, { type: Type }>
	: APIBaseComponent<ComponentType>;
export class Component<
	Type extends APIMessageComponent | APIModalComponent,
	Omitted extends keyof Type | '' = '',
> extends Structure<Type, Omitted> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<Type, Omitted>) {
		super(data as Type);
	}

	public get id() {
		return this[kData].id;
	}

	public get type() {
		return this[kData].type;
	}
}
