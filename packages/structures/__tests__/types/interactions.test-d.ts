import type {
	APIApplicationCommandAutocompleteInteraction,
	APIApplicationCommandInteraction,
	APIChatInputApplicationCommandInteractionData,
	APIInteraction,
	APIMessageApplicationCommandInteractionData,
	APIMessageComponentInteraction,
	APIMessageUserSelectInteractionData,
	APIModalSubmission,
	APIModalSubmitInteraction,
	APIPingInteraction,
	APIUser,
	APIUserApplicationCommandInteractionData,
	ComponentType,
	Locale,
	ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import { ApplicationCommandType, InteractionType } from 'discord-api-types/v10';
import { expectTypeOf } from 'vitest';
import type { PermissionsBitField } from '../../src/bitfields/PermissionsBitField.js';
import {
	ApplicationCommandInteraction,
	ApplicationCommandInteractionData,
	ApplicationCommandInteractionDataOption,
	ApplicationCommandInteractionDataBasicOption,
	type AutocompleteInteraction,
	AutocompleteInteractionData,
	AutocompleteInteractionDataOption,
	type ContextMenuInteractionData,
	Interaction,
	type InteractionDataType,
	type MessageComponentInteraction,
	MessageComponentInteractionData,
	ModalSubmitInteraction,
	ModalSubmitInteractionData,
	ModalSubmitComponent,
	ModalSubmitValueField,
	type ModalSubmitValuesField,
	type PartializeInteraction,
	type PingInteraction,
	type ResolvedInteractionData,
	SelectMenuInteractionData,
} from '../../src/interactions/index.js';
import type { User } from '../../src/users/User.js';
import { kData } from '../../src/utils/symbols.js';

expectTypeOf<InteractionDataType<InteractionType.Ping>>().toEqualTypeOf<APIPingInteraction>();
expectTypeOf<
	InteractionDataType<InteractionType.ApplicationCommand>
>().toEqualTypeOf<APIApplicationCommandInteraction>();
expectTypeOf<
	InteractionDataType<InteractionType.ApplicationCommandAutocomplete>
>().toEqualTypeOf<APIApplicationCommandAutocompleteInteraction>();
expectTypeOf<InteractionDataType<InteractionType.MessageComponent>>().toEqualTypeOf<APIMessageComponentInteraction>();
expectTypeOf<InteractionDataType<InteractionType.ModalSubmit>>().toEqualTypeOf<APIModalSubmitInteraction>();
expectTypeOf<InteractionDataType<InteractionType>>().toEqualTypeOf<APIInteraction>();

declare const ping: PingInteraction;
declare const command: ApplicationCommandInteraction;
declare const autocomplete: AutocompleteInteraction;
declare const component: MessageComponentInteraction;
declare const modal: ModalSubmitInteraction;

expectTypeOf(ping.type).toEqualTypeOf<InteractionType.Ping>();
expectTypeOf(command.type).toEqualTypeOf<InteractionType.ApplicationCommand>();
expectTypeOf(autocomplete.type).toEqualTypeOf<InteractionType.ApplicationCommandAutocomplete>();
expectTypeOf(component.type).toEqualTypeOf<InteractionType.MessageComponent>();
expectTypeOf(modal.type).toEqualTypeOf<InteractionType.ModalSubmit>();
expectTypeOf(command.locale).toEqualTypeOf<Locale>();
expectTypeOf(command.channelId).toEqualTypeOf<string>();
expectTypeOf(modal.channelId).toEqualTypeOf<string | undefined>();
expectTypeOf(modal.guildId).toEqualTypeOf<string | undefined>();
expectTypeOf(modal.appPermissions).toEqualTypeOf<PermissionsBitField | null>();
expectTypeOf(modal.attachmentSizeLimit).toEqualTypeOf<number>();
expectTypeOf(modal.version).toEqualTypeOf<1>();

class CustomOmissions extends Interaction<InteractionType.ModalSubmit, 'token'> {
	public rawPermissions() {
		return this[kData].app_permissions;
	}
}
expectTypeOf<CustomOmissions['rawPermissions']>().returns.toBeUnknown();

// @ts-expect-error Pings have no locale
expectTypeOf(ping.locale);
// @ts-expect-error The nested data getter belongs to a caching subclass
expectTypeOf(command.data);
// @ts-expect-error Nested messages belong to a caching subclass
expectTypeOf(component.message);

declare const envelope:
	| ApplicationCommandInteraction
	| AutocompleteInteraction
	| MessageComponentInteraction
	| ModalSubmitInteraction
	| PingInteraction;
if (envelope.type === InteractionType.Ping) {
	expectTypeOf(envelope).toEqualTypeOf<PingInteraction>();
} else if (envelope.type === InteractionType.ModalSubmit) {
	expectTypeOf(envelope).toEqualTypeOf<ModalSubmitInteraction>();
} else if (envelope.type === InteractionType.ApplicationCommand) {
	expectTypeOf(envelope).toEqualTypeOf<ApplicationCommandInteraction>();
}

const json = new Interaction({} as APIInteraction).toJSON();
if (json.type === InteractionType.Ping) {
	expectTypeOf(json.data).toEqualTypeOf<undefined>();
} else if (json.type === InteractionType.ApplicationCommandAutocomplete) {
	expectTypeOf(json.data.options).toBeArray();
} else if (json.type === InteractionType.ApplicationCommand) {
	if (json.data.type === ApplicationCommandType.User) {
		expectTypeOf(json.data).toEqualTypeOf<APIUserApplicationCommandInteractionData>();
		expectTypeOf(json.data.resolved.users).toEqualTypeOf<Record<string, APIUser>>();
	} else if (json.data.type === ApplicationCommandType.Message) {
		expectTypeOf(json.data).toEqualTypeOf<APIMessageApplicationCommandInteractionData>();
	} else if (json.data.type === ApplicationCommandType.ChatInput) {
		expectTypeOf(json.data).toEqualTypeOf<APIChatInputApplicationCommandInteractionData>();
	}
}

declare const omitted: ModalSubmitInteraction<'token' | 'locale' | 'id'>;
expectTypeOf(omitted.token).toBeUnknown();
expectTypeOf(omitted.locale).toBeUnknown();
expectTypeOf(omitted.id).toBeUnknown();
expectTypeOf(omitted.applicationId).toEqualTypeOf<string>();
// Omissions do not narrow the API return contract of toJSON, matching Structure.
expectTypeOf(omitted.toJSON()).toEqualTypeOf<APIModalSubmitInteraction>();

declare const chatInput: ApplicationCommandInteractionData<ApplicationCommandType.ChatInput>;
declare const userCommand: ContextMenuInteractionData<ApplicationCommandType.User>;
declare const messageCommand: ContextMenuInteractionData<ApplicationCommandType.Message>;
expectTypeOf(chatInput.type).toEqualTypeOf<ApplicationCommandType.ChatInput>();
expectTypeOf(chatInput.toJSON()).toEqualTypeOf<APIChatInputApplicationCommandInteractionData>();
expectTypeOf(userCommand.targetId).toEqualTypeOf<string>();
expectTypeOf(userCommand.toJSON()).toEqualTypeOf<APIUserApplicationCommandInteractionData>();
expectTypeOf(messageCommand.toJSON()).toEqualTypeOf<APIMessageApplicationCommandInteractionData>();

declare const omittedTarget: ContextMenuInteractionData<ApplicationCommandType.User, 'target_id'>;
expectTypeOf(omittedTarget.targetId).toBeUnknown();

declare const autocompleteData: AutocompleteInteractionData;
const option = autocompleteData.toJSON().options[0]!;
if (option.type === 4 || option.type === 10) {
	expectTypeOf(option.value).toEqualTypeOf<string>();
	expectTypeOf(option.focused).toEqualTypeOf<boolean | undefined>();
}

declare const buttonData: MessageComponentInteractionData<ComponentType.Button>;
declare const userSelect: SelectMenuInteractionData<ComponentType.UserSelect>;
expectTypeOf(buttonData.componentType).toEqualTypeOf<ComponentType.Button>();
expectTypeOf(userSelect.componentType).toEqualTypeOf<ComponentType.UserSelect>();
expectTypeOf(userSelect.values).toEqualTypeOf<readonly string[]>();
expectTypeOf(userSelect.toJSON()).toEqualTypeOf<APIMessageUserSelectInteractionData>();
// @ts-expect-error Buttons have no selected values
expectTypeOf(buttonData.values);
// @ts-expect-error A button cannot be constructed as a select menu
new SelectMenuInteractionData<ComponentType.Button>({ custom_id: 'button', component_type: 2 });

declare const omittedValues: SelectMenuInteractionData<ComponentType.StringSelect, 'values'>;
expectTypeOf(omittedValues.values).toBeUnknown();

class CachedModal extends ModalSubmitInteraction {
	public get data(): ModalSubmitInteractionData {
		throw new Error('Type-only subclass');
	}

	public get user(): User | undefined {
		throw new Error('Type-only subclass');
	}
}

class CachedSubmission extends ModalSubmitInteractionData {
	public get components(): ReadonlyMap<string, string | null> {
		throw new Error('Type-only subclass');
	}

	public get resolved(): ResolvedInteractionData | undefined {
		throw new Error('Type-only subclass');
	}
}

expectTypeOf<CachedModal['data']>().toEqualTypeOf<ModalSubmitInteractionData>();
expectTypeOf<CachedSubmission['components']>().toEqualTypeOf<ReadonlyMap<string, string | null>>();
expectTypeOf<CachedSubmission['toJSON']>().returns.toEqualTypeOf<APIModalSubmission>();

// Constructor unions keep fields belonging only to particular variants.
declare const validCommand: APIApplicationCommandInteraction;
new ApplicationCommandInteraction(validCommand);
new Interaction(validCommand);
// @ts-expect-error Context menu command data requires target_id and resolved data
new ApplicationCommandInteractionData({ id: '1', name: 'inspect', type: 2 });
// @ts-expect-error Selecting users requires a users map in resolved
new MessageComponentInteractionData({ custom_id: 'user', component_type: 5, values: [] });
// @ts-expect-error Autocomplete always has an options array in the incoming envelope
new AutocompleteInteractionData({ id: '1', name: 'search', type: 1 });
// @ts-expect-error An incoming command envelope must have data unless explicitly omitted
new ApplicationCommandInteraction({ ...validCommand, data: undefined });

declare const withoutData: Omit<APIApplicationCommandInteraction, 'data'>;
new ApplicationCommandInteraction<'data'>(withoutData);

declare const partialized: PartializeInteraction<APIApplicationCommandInteraction, 'token'>;
if (partialized.data.type === ApplicationCommandType.User) {
	expectTypeOf(partialized.data.target_id).toEqualTypeOf<string>();
	expectTypeOf(partialized.token).toEqualTypeOf<string | undefined>();
}

declare const stringOption: ApplicationCommandInteractionDataBasicOption<ApplicationCommandOptionType.String>;
declare const integerOption: ApplicationCommandInteractionDataBasicOption<ApplicationCommandOptionType.Integer>;
declare const booleanOption: ApplicationCommandInteractionDataBasicOption<ApplicationCommandOptionType.Boolean>;
declare const autocompleteInteger: AutocompleteInteractionDataOption<ApplicationCommandOptionType.Integer>;
expectTypeOf(stringOption.value).toEqualTypeOf<string>();
expectTypeOf(integerOption.value).toEqualTypeOf<number>();
expectTypeOf(booleanOption.value).toEqualTypeOf<boolean>();
expectTypeOf(autocompleteInteger.value).toEqualTypeOf<string>();
expectTypeOf(autocompleteInteger.focused).toEqualTypeOf<boolean | undefined>();
declare const omittedOption: AutocompleteInteractionDataOption<
	ApplicationCommandOptionType.Integer,
	'value' | 'focused'
>;
expectTypeOf(omittedOption.value).toBeUnknown();
expectTypeOf(omittedOption.focused).toBeUnknown();
new ApplicationCommandInteractionDataBasicOption<ApplicationCommandOptionType.Integer>({
	type: 4,
	name: 'count',
	// @ts-expect-error Incomplete numeric strings require the autocomplete interaction kind
	value: '-',
});
// @ts-expect-error Incoming autocomplete numbers are strings, not parsed numbers
new AutocompleteInteractionDataOption<ApplicationCommandOptionType.Number>({ type: 10, name: 'count', value: 1 });
// @ts-expect-error Subcommand groups require child options
new ApplicationCommandInteractionDataOption<ApplicationCommandOptionType.SubcommandGroup>({ type: 2, name: 'group' });
// @ts-expect-error Nested options are reserved for caching subclasses
expectTypeOf(new ApplicationCommandInteractionDataOption({ type: 1, name: 'subcommand' }).options);

declare const textField: ModalSubmitValueField<ComponentType.TextInput>;
declare const radioField: ModalSubmitValueField<ComponentType.RadioGroup>;
declare const checkboxField: ModalSubmitValueField<ComponentType.Checkbox>;
declare const selectedFields: ModalSubmitValuesField<ComponentType.FileUpload>;
expectTypeOf(textField.value).toEqualTypeOf<string>();
expectTypeOf(radioField.value).toEqualTypeOf<string | null>();
expectTypeOf(checkboxField.value).toEqualTypeOf<boolean>();
expectTypeOf(selectedFields.values).toEqualTypeOf<readonly string[]>();
expectTypeOf(selectedFields.type).toEqualTypeOf<ComponentType.FileUpload>();
declare const omittedField: ModalSubmitValuesField<ComponentType.FileUpload, 'values'>;
expectTypeOf(omittedField.values).toBeUnknown();
declare const omittedScalar: ModalSubmitValueField<ComponentType.RadioGroup, 'value'>;
expectTypeOf(omittedScalar.value).toBeUnknown();
// @ts-expect-error Received radio selections can be null; checkbox responses must be booleans
new ModalSubmitValueField<ComponentType.Checkbox>({ type: 23, custom_id: 'checkbox', value: null });
// @ts-expect-error Container responses leave child components to caching subclasses
expectTypeOf(new ModalSubmitComponent({ type: 1, components: [] }).components);
// @ts-expect-error Readonly copies cannot be mutated through the exposed API
selectedFields.values.push('another');
// @ts-expect-error Readonly copies cannot be mutated through the exposed API
userSelect.values.push('another');
