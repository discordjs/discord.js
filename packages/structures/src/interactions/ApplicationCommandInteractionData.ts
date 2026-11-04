import type { APIApplicationCommandInteractionData, ApplicationCommandType } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { PartializeInteraction } from './types.js';

/**
 * The raw invocation data for a particular application command type.
 */
export type ApplicationCommandInteractionDataType<Type extends ApplicationCommandType> = {
	[Kind in ApplicationCommandType]: Extract<APIApplicationCommandInteractionData, { type: Kind }>;
}[Type];

/**
 * Data describing an invoked command, rather than its registration definition.
 *
 * @typeParam Type - The invoked command type
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `options` and `resolved` fields contain `ApplicationCommandInteractionDataOption`
 * and `ResolvedInteractionData` substructures.
 * An extending class must construct and store these and may expose its own getters for them.
 */
export class ApplicationCommandInteractionData<
	Type extends ApplicationCommandType = ApplicationCommandType,
	Omitted extends keyof ApplicationCommandInteractionDataType<Type> | '' = '',
> extends Structure<ApplicationCommandInteractionDataType<Type>, Omitted> {
	public static override readonly DataTemplate: Partial<APIApplicationCommandInteractionData> = {};

	/**
	 * @param data - The raw data describing the command invocation
	 */
	public constructor(data: PartializeInteraction<ApplicationCommandInteractionDataType<Type>, Omitted>) {
		super(data);
	}

	/**
	 * The id of the invoked command
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the invoked command
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The type of the invoked command
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * The guild in which the command is registered, if any
	 */
	public get guildId() {
		return this[kData].guild_id;
	}
}

/**
 * Data for an invoked user or message context menu command.
 *
 * @typeParam Type - The context menu command type
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `resolved` field contains `ResolvedInteractionData`, left for extending classes,
 * including its `Message` map for message commands.
 */
export class ContextMenuInteractionData<
	Type extends ApplicationCommandType.Message | ApplicationCommandType.User =
		| ApplicationCommandType.Message
		| ApplicationCommandType.User,
	Omitted extends keyof ApplicationCommandInteractionDataType<Type> | '' = '',
> extends ApplicationCommandInteractionData<Type, Omitted> {
	public static override readonly DataTemplate: Partial<
		ApplicationCommandInteractionDataType<ApplicationCommandType.Message | ApplicationCommandType.User>
	> = {};

	/**
	 * @param data - The raw context menu command invocation data
	 */
	public constructor(data: PartializeInteraction<ApplicationCommandInteractionDataType<Type>, Omitted>) {
		super(data);
	}

	/**
	 * The id of the user or message targeted by the command
	 */
	public get targetId() {
		return this[kData].target_id;
	}
}
