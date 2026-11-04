import type {
	APIApplicationCommandInteractionDataOption,
	ApplicationCommandOptionType,
	InteractionType,
} from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { ReplaceOmittedWithUnknown } from '../utils/types.js';
import type { PartializeInteraction } from './types.js';

/**
 * Interaction types carrying application command option values.
 */
export type CommandOptionInteractionType =
	| InteractionType.ApplicationCommand
	| InteractionType.ApplicationCommandAutocomplete;

/**
 * The raw incoming option, with numeric autocomplete input represented as strings.
 */
export type ApplicationCommandInteractionDataOptionType<
	Type extends ApplicationCommandOptionType,
	Kind extends CommandOptionInteractionType = InteractionType.ApplicationCommand,
> = {
	[OptionType in ApplicationCommandOptionType]: Extract<
		APIApplicationCommandInteractionDataOption<Kind>,
		{ type: OptionType }
	>;
}[Type];

/**
 * An incoming command option or nested subcommand, rather than an option registration definition.
 *
 * @typeParam Type - The option type
 * @typeParam Kind - Command invocation or autocomplete input
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `options` array contains `ApplicationCommandInteractionDataOption` substructures,
 * left for extending classes to construct and store. Leaf options can use `ApplicationCommandInteractionDataBasicOption`.
 */
export class ApplicationCommandInteractionDataOption<
	Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
	Kind extends CommandOptionInteractionType = InteractionType.ApplicationCommand,
	Omitted extends keyof ApplicationCommandInteractionDataOptionType<Type, Kind> | '' = '',
> extends Structure<ApplicationCommandInteractionDataOptionType<Type, Kind>, Omitted> {
	public static override readonly DataTemplate: Partial<
		APIApplicationCommandInteractionDataOption<CommandOptionInteractionType>
	> = {};

	/**
	 * @param data - The raw incoming option
	 */
	public constructor(data: PartializeInteraction<ApplicationCommandInteractionDataOptionType<Type, Kind>, Omitted>) {
		super(data);
	}

	/**
	 * The option's name
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The option's type
	 */
	public get type() {
		return this[kData].type;
	}
}

/**
 * An option type that has a scalar value instead of child options.
 */
export type BasicCommandInteractionOptionType = Exclude<
	ApplicationCommandOptionType,
	ApplicationCommandOptionType.Subcommand | ApplicationCommandOptionType.SubcommandGroup
>;

/**
 * A submitted scalar command option value, including entity ids and false or zero values.
 *
 * @typeParam Type - The leaf option type
 * @typeParam Kind - Command invocation or autocomplete input
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 */
export class ApplicationCommandInteractionDataBasicOption<
	Type extends BasicCommandInteractionOptionType = BasicCommandInteractionOptionType,
	Kind extends CommandOptionInteractionType = InteractionType.ApplicationCommand,
	Omitted extends keyof ApplicationCommandInteractionDataOptionType<Type, Kind> | '' = '',
> extends ApplicationCommandInteractionDataOption<Type, Kind, Omitted> {
	public static override readonly DataTemplate: Partial<
		ApplicationCommandInteractionDataOptionType<BasicCommandInteractionOptionType, CommandOptionInteractionType>
	> = {};

	/**
	 * @param data - The raw incoming leaf option
	 */
	public constructor(data: PartializeInteraction<ApplicationCommandInteractionDataOptionType<Type, Kind>, Omitted>) {
		super(data);
	}

	/**
	 * The scalar value submitted for this option
	 */
	public get value(): ReplaceOmittedWithUnknown<
		Omitted,
		ApplicationCommandInteractionDataOptionType<Type, Kind>
	>['value'] {
		return this[kData].value;
	}
}

/**
 * Types of options which may be focused for autocomplete.
 */
export type AutocompleteCommandOptionType =
	| ApplicationCommandOptionType.Integer
	| ApplicationCommandOptionType.Number
	| ApplicationCommandOptionType.String;

/**
 * A focusable autocomplete option, preserving incomplete input strings.
 *
 * @typeParam Type - String, integer, or number input
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 */
export class AutocompleteInteractionDataOption<
	Type extends AutocompleteCommandOptionType = AutocompleteCommandOptionType,
	Omitted extends
		| keyof ApplicationCommandInteractionDataOptionType<Type, InteractionType.ApplicationCommandAutocomplete>
		| '' = '',
> extends ApplicationCommandInteractionDataBasicOption<Type, InteractionType.ApplicationCommandAutocomplete, Omitted> {
	public static override readonly DataTemplate: Partial<
		ApplicationCommandInteractionDataOptionType<
			AutocompleteCommandOptionType,
			InteractionType.ApplicationCommandAutocomplete
		>
	> = {};

	/**
	 * @param data - The raw focusable autocomplete option
	 */
	public constructor(
		data: PartializeInteraction<
			ApplicationCommandInteractionDataOptionType<Type, InteractionType.ApplicationCommandAutocomplete>,
			Omitted
		>,
	) {
		super(data);
	}

	/**
	 * Whether this option is the currently focused autocomplete input, if supplied
	 */
	public get focused() {
		return this[kData].focused;
	}
}
