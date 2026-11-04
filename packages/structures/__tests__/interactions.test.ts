import { DiscordSnowflake } from '@sapphire/snowflake';
import {
	type APIChatInputApplicationCommandInteractionData,
	type APIApplicationCommandAutocompleteInteraction,
	type APIApplicationCommandInteraction,
	type APIApplicationCommandInteractionDataBasicOption,
	type APIInteractionDataResolved,
	type APIMessage,
	type APIMessageComponentInteraction,
	type APIMessageApplicationCommandInteractionData,
	type APIModalSubmission,
	type APIModalSubmitInteraction,
	type APIPingInteraction,
	type APIUser,
	type APIUserApplicationCommandInteractionData,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ChannelType,
	ComponentType,
	InteractionType,
	Locale,
	MessageType,
} from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { PermissionsBitField } from '../src/bitfields/PermissionsBitField.js';
import {
	ApplicationCommandInteraction,
	ApplicationCommandInteractionData,
	ApplicationCommandInteractionDataOption,
	type ApplicationCommandInteractionDataOptionType,
	ApplicationCommandInteractionDataBasicOption,
	AutocompleteInteraction,
	AutocompleteInteractionData,
	AutocompleteInteractionDataOption,
	ContextMenuInteractionData,
	Interaction,
	MessageComponentInteraction,
	MessageComponentInteractionData,
	ModalSubmitInteraction,
	ModalSubmitInteractionData,
	ModalSubmitComponent,
	type ModalSubmitComponentAPIData,
	ModalSubmitValueField,
	ModalSubmitValuesField,
	PingInteraction,
	ResolvedInteractionData,
	SelectMenuInteractionData,
} from '../src/interactions/index.js';
import { User } from '../src/users/User.js';
import { kClone, kData, kPatch } from '../src/utils/symbols.js';

const user: APIUser = {
	id: '474807795183648809',
	username: 'example',
	discriminator: '0',
	global_name: null,
	avatar: null,
};

const base = {
	id: '1081589159740833934',
	application_id: '348607796335607817',
	token: 'interaction-token',
	version: 1,
	app_permissions: '0',
	entitlements: [],
	authorizing_integration_owners: { 1: user.id },
	attachment_size_limit: 10_485_760,
} as const;

const userBase = {
	...base,
	entitlements: [],
	locale: Locale.EnglishUS,
	channel_id: '222086648706498562',
	channel: { id: '222086648706498562', type: ChannelType.DM as const },
	user,
};

const commandData: APIChatInputApplicationCommandInteractionData = {
	id: '123456789012345678',
	name: 'search',
	type: ApplicationCommandType.ChatInput,
	options: [
		{ name: 'count', type: ApplicationCommandOptionType.Integer, value: 0 },
		{ name: 'enabled', type: ApplicationCommandOptionType.Boolean, value: false },
	],
	resolved: { users: { [user.id]: user } },
};

const message: APIMessage = {
	id: '123456789012345679',
	channel_id: userBase.channel_id,
	author: user,
	content: 'Choose an option',
	timestamp: '1970-01-01T00:00:00.000Z',
	edited_timestamp: null,
	tts: false,
	mention_everyone: false,
	mentions: [],
	mention_roles: [],
	attachments: [],
	embeds: [],
	pinned: false,
	type: MessageType.Default,
};

const modalData: APIModalSubmission = {
	custom_id: 'preferences',
	components: [
		{
			type: ComponentType.ActionRow,
			components: [{ type: ComponentType.TextInput, custom_id: 'name', value: '' }],
		},
		{
			type: ComponentType.Label,
			component: { type: ComponentType.RadioGroup, custom_id: 'choice', value: null },
		},
		{
			type: ComponentType.Label,
			component: { type: ComponentType.Checkbox, custom_id: 'enabled', value: false },
		},
	],
};

const modal: APIModalSubmitInteraction = {
	...userBase,
	type: InteractionType.ModalSubmit,
	data: modalData,
};

class MutableModalInteraction extends ModalSubmitInteraction {
	public patch(data: Partial<APIModalSubmitInteraction>) {
		return this[kPatch](data);
	}

	public clone(data?: Partial<APIModalSubmitInteraction>) {
		return this[kClone](data);
	}
}

describe('Incoming interaction envelopes', () => {
	test('exposes scalar metadata without creating nested structures', () => {
		const data: APIModalSubmitInteraction = {
			...modal,
			guild_id: '123456789012345680',
			guild_locale: Locale.German,
		};
		const interaction = new ModalSubmitInteraction(data);
		expect(interaction.id).toBe(data.id);
		expect(interaction.applicationId).toBe(data.application_id);
		expect(interaction.type).toBe(InteractionType.ModalSubmit);
		expect(interaction.guildId).toBe(data.guild_id);
		expect(interaction.channelId).toBe(data.channel_id);
		expect(interaction.token).toBe(data.token);
		expect(interaction.version).toBe(1);
		expect(interaction.appPermissions).toBeInstanceOf(PermissionsBitField);
		expect(interaction.appPermissions?.bitField).toBe(0n);
		expect(interaction.locale).toBe(Locale.EnglishUS);
		expect(interaction.guildLocale).toBe(Locale.German);
		expect(interaction.attachmentSizeLimit).toBe(data.attachment_size_limit);
		expect(interaction.context).toBeUndefined();
		expect(interaction.createdTimestamp).toBe(DiscordSnowflake.timestampFrom(data.id));
		expect(interaction.createdDate?.valueOf()).toBe(interaction.createdTimestamp);
		for (const field of ['data', 'guild', 'channel', 'member', 'user', 'message', 'entitlements']) {
			expect(field in interaction).toBe(false);
		}
	});

	test('roundtrips each incoming interaction type and deep clones nested data', () => {
		class InspectablePing extends PingInteraction {
			public get rawData() {
				return this[kData];
			}
		}
		class InspectableCommand extends ApplicationCommandInteraction {
			public get rawData() {
				return this[kData];
			}
		}
		class InspectableAutocomplete extends AutocompleteInteraction {
			public get rawData() {
				return this[kData];
			}
		}
		class InspectableComponent extends MessageComponentInteraction {
			public get rawData() {
				return this[kData];
			}
		}
		class InspectableModal extends ModalSubmitInteraction {
			public get rawData() {
				return this[kData];
			}
		}
		const ping: APIPingInteraction = { ...base, entitlements: [], type: InteractionType.Ping };
		const command: APIApplicationCommandInteraction = {
			...userBase,
			type: InteractionType.ApplicationCommand,
			data: commandData,
		};
		const autocomplete: APIApplicationCommandAutocompleteInteraction = {
			...userBase,
			type: InteractionType.ApplicationCommandAutocomplete,
			data: {
				id: commandData.id,
				name: commandData.name,
				type: ApplicationCommandType.ChatInput,
				options: [{ name: 'count', type: ApplicationCommandOptionType.Integer, value: '-', focused: true }],
			},
		};
		const component: APIMessageComponentInteraction = {
			...userBase,
			type: InteractionType.MessageComponent,
			data: {
				custom_id: 'choose',
				component_type: ComponentType.UserSelect,
				values: [user.id],
				resolved: { users: { [user.id]: user } },
			},
			message,
		};

		const pairs = [
			[new InspectablePing(ping), ping],
			[new InspectableCommand(command), command],
			[new InspectableAutocomplete(autocomplete), autocomplete],
			[new InspectableComponent(component), component],
			[new InspectableModal(modal), modal],
		] as const;
		for (const [interaction, payload] of pairs) {
			const json = interaction.toJSON();
			expect(json).toStrictEqual(payload);
			expect(json).not.toBe(payload);
			if ('data' in json) {
				expect(json.data).not.toBe(payload.data);
			}
			expect(JSON.parse(JSON.stringify(interaction))).toStrictEqual(payload);
			// Inspect the stored raw data, including templates selected by each concrete constructor.
			expect(Object.hasOwn(interaction.rawData, 'app_permissions')).toBe(false);
			expect(interaction.appPermissions?.bitField).toBe(0n);
			const mutable = interaction as unknown as {
				[kPatch](data: { app_permissions: string }): typeof interaction;
				[kClone](): typeof interaction;
			};
			mutable[kPatch]({ app_permissions: '8' });
			expect(Object.hasOwn(interaction.rawData, 'app_permissions')).toBe(false);
			expect(interaction.appPermissions?.bitField).toBe(8n);
			expect(interaction.toJSON().app_permissions).toBe('8');
			mutable[kPatch]({ app_permissions: '0' });
			const clone = mutable[kClone]();
			expect(clone.constructor).toBe(interaction.constructor);
			expect(Object.hasOwn(clone.rawData, 'app_permissions')).toBe(false);
			expect(clone.appPermissions?.bitField).toBe(0n);
			expect(clone.toJSON().app_permissions).toBe('0');
		}
	});

	test('permission omissions and explicit undefined patches clear optimized state safely', () => {
		const { app_permissions: _permissions, ...withoutPermissions } = modal;
		const interaction = new MutableModalInteraction(withoutPermissions);
		expect(interaction.appPermissions).toBeNull();
		expect(interaction.toJSON()).not.toHaveProperty('app_permissions');
		interaction.patch({ app_permissions: '8' });
		expect(interaction.appPermissions?.bitField).toBe(8n);
		interaction.patch({ token: 'unrelated' });
		expect(interaction.appPermissions?.bitField).toBe(8n);
		interaction.patch({ app_permissions: undefined } as unknown as Partial<APIModalSubmitInteraction>);
		expect(interaction.appPermissions).toBeNull();
		expect(interaction.toJSON()).not.toHaveProperty('app_permissions');
		expect(interaction.clone().appPermissions).toBeNull();
	});

	test('ping does not expose a locale and accepts its API envelope', () => {
		const ping = new PingInteraction({ ...base, entitlements: [], type: InteractionType.Ping });
		expect(ping.type).toBe(InteractionType.Ping);
		expect('locale' in ping).toBe(false);
		expect(ping.toJSON()).not.toHaveProperty('data');
	});

	test('patches in place and clones into the same subclass', () => {
		const interaction = new MutableModalInteraction(modal);
		const previous = interaction.toJSON();
		expect(interaction.patch({ token: 'new-token', guild_locale: Locale.German })).toBe(interaction);
		expect(interaction.token).toBe('new-token');
		expect(interaction.guildLocale).toBe(Locale.German);
		expect(interaction.toJSON().data).toStrictEqual(modalData);
		expect(previous).toStrictEqual(modal);

		const clone = interaction.clone({ token: 'clone-token' });
		expect(clone).toBeInstanceOf(MutableModalInteraction);
		expect(clone).not.toBe(interaction);
		expect(clone.token).toBe('clone-token');
		expect(interaction.token).toBe('new-token');
		expect(clone.toJSON().data).not.toBe(interaction.toJSON().data);
	});

	test('omits raw fields with a subclass template and leaves nested getters available', () => {
		class CachedModal extends ModalSubmitInteraction<'token' | 'user'> {
			public static override readonly DataTemplate = {
				set token(_value: string) {},
				set user(_value: APIUser) {},
			};

			public get user() {
				return new User(user);
			}

			public patch(data: Partial<APIModalSubmitInteraction>) {
				return this[kPatch](data);
			}

			public clone() {
				return this[kClone]();
			}
		}

		const cached = new CachedModal(modal);
		expect(cached.token).toBeUndefined();
		expect(cached.user).toBeInstanceOf(User);
		expect(cached.toJSON()).not.toHaveProperty('user');
		expect(cached.toJSON()).not.toHaveProperty('token');
		cached.patch({ token: 'still omitted', user });
		expect(cached.token).toBeUndefined();
		expect(cached.clone()).toBeInstanceOf(CachedModal);
		expect(cached.clone().toJSON()).toStrictEqual(cached.toJSON());
	});

	test('preserves absent optional fields and nested nulls without changing timestamps', () => {
		const interaction = new ModalSubmitInteraction({ ...modal, message });
		expect(interaction.guildId).toBeUndefined();
		expect(interaction.guildLocale).toBeUndefined();
		expect(interaction.toJSON()).not.toHaveProperty('guild_id');
		expect(interaction.toJSON().message?.edited_timestamp).toBeNull();
		expect(interaction.toJSON().message?.timestamp).toBe('1970-01-01T00:00:00.000Z');
		expect(interaction.toJSON().user?.global_name).toBeNull();
	});

	test('does not confuse a zero timestamp with an absent timestamp', () => {
		class EpochInteraction extends Interaction {
			public override get createdTimestamp() {
				return 0;
			}
		}
		expect(new EpochInteraction(modal).createdDate?.valueOf()).toBe(0);
		const { id: _id, ...withoutId } = modal;
		const omitted = new Interaction<InteractionType.ModalSubmit, 'id'>(withoutId);
		expect(omitted.createdTimestamp).toBeNull();
		expect(omitted.createdDate).toBeNull();
	});
});

describe('Incoming command option data', () => {
	test('preserves every basic option type and scalar values without using command definition fields', () => {
		const options: APIApplicationCommandInteractionDataBasicOption<InteractionType.ApplicationCommand>[] = [
			{ name: 'string', type: ApplicationCommandOptionType.String, value: '' },
			{ name: 'integer', type: ApplicationCommandOptionType.Integer, value: 0 },
			{ name: 'boolean', type: ApplicationCommandOptionType.Boolean, value: false },
			{ name: 'user', type: ApplicationCommandOptionType.User, value: user.id },
			{ name: 'channel', type: ApplicationCommandOptionType.Channel, value: userBase.channel_id },
			{ name: 'role', type: ApplicationCommandOptionType.Role, value: '1' },
			{ name: 'mentionable', type: ApplicationCommandOptionType.Mentionable, value: '2' },
			{ name: 'number', type: ApplicationCommandOptionType.Number, value: 0.5 },
			{ name: 'attachment', type: ApplicationCommandOptionType.Attachment, value: '3' },
		];
		for (const payload of options) {
			const option = new ApplicationCommandInteractionDataBasicOption(payload);
			expect(option.name).toBe(payload.name);
			expect(option.type).toBe(payload.type);
			expect(option.value).toBe(payload.value);
			expect(option.toJSON()).toStrictEqual(payload);
		}
	});

	test('nested subcommands preserve raw child options without exposing a getter', () => {
		const payload = {
			name: 'admin',
			type: ApplicationCommandOptionType.SubcommandGroup as const,
			options: [
				{
					name: 'set',
					type: ApplicationCommandOptionType.Subcommand as const,
					options: [{ name: 'enabled', type: ApplicationCommandOptionType.Boolean as const, value: false }],
				},
			],
		};
		const option = new ApplicationCommandInteractionDataOption(payload);
		expect('options' in option).toBe(false);
		expect('value' in option).toBe(false);
		expect(option.toJSON()).toStrictEqual(payload);
		const serialized = option.toJSON();
		if (serialized.type === ApplicationCommandOptionType.SubcommandGroup) {
			serialized.options[0]!.options = [];
		}
		expect(option.toJSON()).toStrictEqual(payload);
	});

	test('autocomplete focus and partial strings patch and clone without coercion', () => {
		type OptionData = ApplicationCommandInteractionDataOptionType<
			ApplicationCommandOptionType.Number,
			InteractionType.ApplicationCommandAutocomplete
		>;
		class MutableOption extends AutocompleteInteractionDataOption<ApplicationCommandOptionType.Number> {
			public patch(data: Partial<OptionData>) {
				return this[kPatch](data);
			}

			public clone(data?: Partial<OptionData>) {
				return this[kClone](data);
			}
		}
		const payload: OptionData = {
			name: 'amount',
			type: ApplicationCommandOptionType.Number,
			value: '-',
			focused: true,
		};
		const option = new MutableOption(payload);
		expect(option.value).toBe('-');
		expect(option.focused).toBe(true);
		expect(option.patch({ value: '1.', focused: false })).toBe(option);
		expect(option.focused).toBe(false);
		const clone = option.clone({ value: '' });
		expect(clone).toBeInstanceOf(MutableOption);
		expect(clone.toJSON()).toStrictEqual({ ...payload, value: '', focused: false });
		expect(option.value).toBe('1.');
	});

	test('option templates can omit a scalar without requiring it from the caller', () => {
		class OmittedValue extends ApplicationCommandInteractionDataBasicOption<
			ApplicationCommandOptionType.String,
			InteractionType.ApplicationCommand,
			'value'
		> {
			public static override readonly DataTemplate: Partial<
				ApplicationCommandInteractionDataOptionType<ApplicationCommandOptionType.String>
			> = {
				set value(_value: string) {},
			};
		}
		const data = new OmittedValue({ name: 'input', type: ApplicationCommandOptionType.String });
		expect(data.value).toBeUndefined();
		expect(data.toJSON()).toStrictEqual({ name: 'input', type: ApplicationCommandOptionType.String });
	});
});

describe('Modal component submission data', () => {
	test('container responses preserve nested submitted fields without constructing them', () => {
		for (const payload of modalData.components) {
			const component = new ModalSubmitComponent(payload);
			expect(component.type).toBe(payload.type);
			expect(component.id).toBeUndefined();
			expect('component' in component).toBe(false);
			expect('components' in component).toBe(false);
			expect(component.toJSON()).toStrictEqual(payload);
		}
		const display = { type: ComponentType.TextDisplay as const, id: 0 };
		expect(new ModalSubmitComponent(display).id).toBe(0);
		expect(new ModalSubmitComponent(display).toJSON()).toStrictEqual(display);
	});

	test('scalar response wrappers preserve empty text, null radio selections, and false checkboxes', () => {
		const fields: Extract<ModalSubmitComponentAPIData, { value: unknown }>[] = [
			{ type: ComponentType.TextInput, custom_id: 'name', value: '' },
			{ type: ComponentType.RadioGroup, custom_id: 'radio', value: null },
			{ type: ComponentType.Checkbox, custom_id: 'checkbox', value: false },
		];
		for (const payload of fields) {
			const field = new ModalSubmitValueField(payload);
			expect(field.customId).toBe(payload.custom_id);
			expect(field.value).toBe(payload.value);
			expect(field.toJSON()).toStrictEqual(payload);
		}
	});

	test('selection response wrappers expose readonly copies for every multi-value field', () => {
		const types = [
			ComponentType.StringSelect,
			ComponentType.UserSelect,
			ComponentType.RoleSelect,
			ComponentType.MentionableSelect,
			ComponentType.ChannelSelect,
			ComponentType.FileUpload,
			ComponentType.CheckboxGroup,
		] as const;
		for (const type of types) {
			const payload = { type, custom_id: 'selection', values: ['1'] };
			const field = new ModalSubmitValuesField(payload);
			expect(field.customId).toBe('selection');
			expect(field.values).toStrictEqual(['1']);
			expect(field.values).not.toBe(payload.values);
			(field.values as string[]).push('2');
			expect(field.toJSON()).toStrictEqual(payload);
		}
		const empty = new ModalSubmitValuesField({ type: ComponentType.FileUpload, custom_id: 'files', values: [] });
		expect(empty.values).toStrictEqual([]);
	});

	test('nullable values patch and clone in a submission subclass', () => {
		type RadioData = { type: ComponentType.RadioGroup; custom_id: string; value: string | null };
		class RadioField extends ModalSubmitValueField<ComponentType.RadioGroup> {
			public patch(data: Partial<RadioData>) {
				return this[kPatch](data);
			}

			public clone(data?: Partial<RadioData>) {
				return this[kClone](data);
			}
		}
		const field = new RadioField({ type: ComponentType.RadioGroup, custom_id: 'choice', value: 'one' });
		expect(field.patch({ value: null })).toBe(field);
		expect(field.value).toBeNull();
		expect(field.clone().toJSON().value).toBeNull();
		const clone = field.clone({ value: 'two' });
		expect(clone).toBeInstanceOf(RadioField);
		expect(clone.value).toBe('two');
		expect(field.value).toBeNull();
	});

	test('omitted selection values remain absent and safe to access', () => {
		class OmittedSelection extends ModalSubmitValuesField<ComponentType.StringSelect, 'values'> {
			public static override readonly DataTemplate: Partial<{
				type: ComponentType.StringSelect;
				custom_id: string;
				values: string[];
			}> = {
				set values(_values: string[]) {},
			};
		}
		const selection = new OmittedSelection({ type: ComponentType.StringSelect, custom_id: 'input' });
		expect(selection.values).toBeUndefined();
		expect(selection.toJSON()).not.toHaveProperty('values');
	});
});

describe('Incoming interaction data', () => {
	test('command data exposes only metadata, preserving options and resolved entity maps', () => {
		const data = { ...commandData, guild_id: '123456789012345680' };
		const command = new ApplicationCommandInteractionData(data);
		expect(command.id).toBe(data.id);
		expect(command.name).toBe('search');
		expect(command.type).toBe(ApplicationCommandType.ChatInput);
		expect(command.guildId).toBe(data.guild_id);
		expect('options' in command).toBe(false);
		expect('resolved' in command).toBe(false);
		expect(command.toJSON()).toStrictEqual(data);
		const serialized = command.toJSON();
		if (serialized.type === ApplicationCommandType.ChatInput) {
			serialized.options?.push({ name: 'extra', type: ApplicationCommandOptionType.Boolean, value: true });
		}
		expect(command.toJSON()).toStrictEqual(data);
	});

	test('preserves user, message, and primary entry point command data variants', () => {
		const userCommand: APIUserApplicationCommandInteractionData = {
			id: commandData.id,
			name: 'inspect',
			type: ApplicationCommandType.User,
			target_id: user.id,
			resolved: { users: { [user.id]: user } },
		};
		const messageCommand: APIMessageApplicationCommandInteractionData = {
			id: commandData.id,
			name: 'quote',
			type: ApplicationCommandType.Message,
			target_id: message.id,
			resolved: { messages: { [message.id]: message } },
		};
		const entryPoint = { id: commandData.id, name: 'launch', type: ApplicationCommandType.PrimaryEntryPoint as const };
		const userData = new ContextMenuInteractionData(userCommand);
		const messageData = new ContextMenuInteractionData(messageCommand);
		expect(userData.targetId).toBe(user.id);
		expect(userData.toJSON()).toStrictEqual(userCommand);
		expect(messageData.targetId).toBe(message.id);
		expect(messageData.toJSON()).toStrictEqual(messageCommand);
		expect(new ApplicationCommandInteractionData(entryPoint).toJSON()).toStrictEqual(entryPoint);
	});

	test('autocomplete retains incomplete numeric strings and focused options', () => {
		const data = {
			id: commandData.id,
			name: 'search',
			type: ApplicationCommandType.ChatInput as const,
			options: [{ name: 'count', type: ApplicationCommandOptionType.Number as const, value: '1.', focused: true }],
		};
		const autocomplete = new AutocompleteInteractionData(data);
		expect(autocomplete.id).toBe(data.id);
		expect(autocomplete.name).toBe(data.name);
		expect(autocomplete.type).toBe(ApplicationCommandType.ChatInput);
		expect(autocomplete.guildId).toBeUndefined();
		expect(autocomplete.toJSON()).toStrictEqual(data);
		expect('options' in autocomplete).toBe(false);
	});

	test('supports button and every select menu data discriminant', () => {
		const button = { custom_id: 'click', component_type: ComponentType.Button as const };
		const buttonData = new MessageComponentInteractionData(button);
		expect(buttonData.customId).toBe('click');
		expect(buttonData.componentType).toBe(ComponentType.Button);
		expect('values' in buttonData).toBe(false);
		expect(buttonData.toJSON()).toStrictEqual(button);

		const selects = [
			{ custom_id: 'string', component_type: ComponentType.StringSelect as const, values: [] },
			{
				custom_id: 'user',
				component_type: ComponentType.UserSelect as const,
				values: [user.id],
				resolved: { users: { [user.id]: user } },
			},
			{ custom_id: 'role', component_type: ComponentType.RoleSelect as const, values: [], resolved: { roles: {} } },
			{ custom_id: 'mentionable', component_type: ComponentType.MentionableSelect as const, values: [], resolved: {} },
			{
				custom_id: 'channel',
				component_type: ComponentType.ChannelSelect as const,
				values: [],
				resolved: { channels: {} },
			},
		];
		for (const data of selects) {
			const select = new SelectMenuInteractionData(data);
			expect(select.componentType).toBe(data.component_type);
			expect(select.customId).toBe(data.custom_id);
			expect(select.values).toStrictEqual(data.values);
			expect('resolved' in select).toBe(false);
			expect(select.toJSON()).toStrictEqual(data);
			expect(select.values).not.toBe(data.values);
			const values = select.values as string[];
			values.push('mutated');
			expect(select.toJSON()).toStrictEqual(data);
		}
	});

	test('modal data preserves submitted empty strings, false, and null values', () => {
		const data = new ModalSubmitInteractionData(modalData);
		expect(data.customId).toBe('preferences');
		expect('components' in data).toBe(false);
		expect('resolved' in data).toBe(false);
		expect(data.toJSON()).toStrictEqual(modalData);
		expect(data.toJSON().components).not.toBe(modalData.components);
	});

	test('data subclasses can patch, clone, omit nested fields, and expose constructed getters', () => {
		class CachedModalData extends ModalSubmitInteractionData<'components' | 'resolved'> {
			public static override readonly DataTemplate = {
				set components(_value: APIModalSubmission['components']) {},
				set resolved(_value: APIInteractionDataResolved) {},
			};

			public get components() {
				return new Map<string, string>();
			}

			public get resolved() {
				return new Map<string, User>();
			}

			public patch(data: Partial<APIModalSubmission>) {
				return this[kPatch](data);
			}

			public clone(data?: Partial<APIModalSubmission>) {
				return this[kClone](data);
			}
		}

		const data = new CachedModalData(modalData);
		expect(data.components).toBeInstanceOf(Map);
		expect(data.resolved).toBeInstanceOf(Map);
		expect(data.toJSON()).toStrictEqual({ custom_id: modalData.custom_id });
		expect(data.patch({ custom_id: 'updated', resolved: {}, components: [] })).toBe(data);
		expect(data.toJSON()).toStrictEqual({ custom_id: 'updated' });
		const clone = data.clone({ custom_id: 'clone' });
		expect(clone).toBeInstanceOf(CachedModalData);
		expect(clone.customId).toBe('clone');
		expect(data.customId).toBe('updated');
	});

	test('resolved data remains subclassable and preserves message maps alongside existing entity maps', () => {
		class ResolvedData extends ResolvedInteractionData {
			public patch(data: Parameters<ResolvedData[typeof kPatch]>[0]) {
				return this[kPatch](data);
			}

			public clone() {
				return this[kClone]();
			}

			public get messages() {
				return new Map(Object.entries(this[kData].messages ?? {}));
			}
		}

		const payload = { users: { [user.id]: user }, messages: { [message.id]: message } };
		const resolved = new ResolvedData(payload);
		expect(resolved.toJSON()).toStrictEqual(payload);
		expect(resolved.messages.get(message.id)).toStrictEqual(message);
		expect('users' in resolved).toBe(false);
		expect(resolved.patch({ attachments: {} })).toBe(resolved);
		expect(resolved.clone()).toBeInstanceOf(ResolvedData);
		expect(resolved.clone().toJSON()).toStrictEqual({ ...payload, attachments: {} });
	});
});
