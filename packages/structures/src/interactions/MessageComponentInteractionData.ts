import type {
	APIMessageComponentInteractionData,
	APIMessageSelectMenuInteractionData,
	ComponentType,
} from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { PartializeInteraction } from './types.js';

/**
 * The raw interaction data for a particular message component type.
 */
export type MessageComponentInteractionDataType<Type extends APIMessageComponentInteractionData['component_type']> = {
	[Kind in APIMessageComponentInteractionData['component_type']]: Extract<
		APIMessageComponentInteractionData,
		{ component_type: Kind }
	>;
}[Type];

/**
 * Data from an invoked message component, rather than the component's definition.
 *
 * @typeParam Type - The type of the invoked component
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `resolved` field on entity selects contains `ResolvedInteractionData`, left for extending classes.
 */
export class MessageComponentInteractionData<
	Type extends APIMessageComponentInteractionData['component_type'] =
		APIMessageComponentInteractionData['component_type'],
	Omitted extends keyof MessageComponentInteractionDataType<Type> | '' = '',
> extends Structure<MessageComponentInteractionDataType<Type>, Omitted> {
	public static override readonly DataTemplate: Partial<APIMessageComponentInteractionData> = {};

	/**
	 * @param data - The raw data from the component interaction
	 */
	public constructor(data: PartializeInteraction<MessageComponentInteractionDataType<Type>, Omitted>) {
		super(data);
	}

	/**
	 * The developer-defined identifier of the invoked component
	 */
	public get customId() {
		return this[kData].custom_id;
	}

	/**
	 * The type of the invoked component
	 */
	public get componentType() {
		return this[kData].component_type;
	}
}

/**
 * Data describing the selected values of a message select menu.
 *
 * @typeParam Type - The type of the invoked select menu
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `resolved` field contains `ResolvedInteractionData`, left for extending classes.
 */
export class SelectMenuInteractionData<
	Type extends Exclude<APIMessageComponentInteractionData['component_type'], ComponentType.Button> =
		APIMessageSelectMenuInteractionData['component_type'],
	Omitted extends keyof MessageComponentInteractionDataType<Type> | '' = '',
> extends MessageComponentInteractionData<Type, Omitted> {
	public static override readonly DataTemplate: Partial<APIMessageSelectMenuInteractionData> = {};

	/**
	 * @param data - The raw select menu interaction data
	 */
	public constructor(data: PartializeInteraction<MessageComponentInteractionDataType<Type>, Omitted>) {
		super(data);
	}

	/**
	 * Selected strings or entity ids
	 */
	public get values() {
		const values = this[kData].values;
		return (Array.isArray(values) ? [...values] : undefined) as Omitted extends 'values' ? unknown : readonly string[];
	}
}
