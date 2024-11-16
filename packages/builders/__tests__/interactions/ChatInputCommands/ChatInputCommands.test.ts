import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	ChannelType,
	InteractionContextType,
	PermissionFlagsBits,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	ChatInputCommandBooleanOption,
	ChatInputCommandBuilder,
	ChatInputCommandChannelOption,
	ChatInputCommandIntegerOption,
	ChatInputCommandMentionableOption,
	ChatInputCommandNumberOption,
	ChatInputCommandRoleOption,
	ChatInputCommandAttachmentOption,
	ChatInputCommandStringOption,
	ChatInputCommandSubcommandBuilder,
	ChatInputCommandSubcommandGroupBuilder,
	ChatInputCommandUserOption,
} from '../../../src/index.js';

const getBuilder = () => new ChatInputCommandBuilder();
const getNamedBuilder = () => getBuilder().setName('example').setDescription('Example command');
const getStringOption = () => new ChatInputCommandStringOption().setName('owo').setDescription('Testing 123');
const getIntegerOption = () => new ChatInputCommandIntegerOption().setName('owo').setDescription('Testing 123');
const getNumberOption = () => new ChatInputCommandNumberOption().setName('owo').setDescription('Testing 123');
const getBooleanOption = () => new ChatInputCommandBooleanOption().setName('owo').setDescription('Testing 123');
const getUserOption = () => new ChatInputCommandUserOption().setName('owo').setDescription('Testing 123');
const getChannelOption = () => new ChatInputCommandChannelOption().setName('owo').setDescription('Testing 123');
const getRoleOption = () => new ChatInputCommandRoleOption().setName('owo').setDescription('Testing 123');
const getAttachmentOption = () => new ChatInputCommandAttachmentOption().setName('owo').setDescription('Testing 123');
const getMentionableOption = () => new ChatInputCommandMentionableOption().setName('owo').setDescription('Testing 123');
const getSubcommandGroup = () =>
	new ChatInputCommandSubcommandGroupBuilder().setName('owo').setDescription('Testing 123');
const getSubcommand = () => new ChatInputCommandSubcommandBuilder().setName('owo').setDescription('Testing 123');

class Collection {
	public readonly [Symbol.toStringTag] = 'Map';
}

describe('ChatInput Commands', () => {
	describe('ChatInputCommandBuilder', () => {
		describe('Builder with no options', () => {
			test('GIVEN empty builder THEN throw error when calling toJSON', () => {
				expect(() => getBuilder().toJSON()).toThrowError();
			});

			test('GIVEN valid builder THEN does not throw error', () => {
				expect(() => getBuilder().setName('example').setDescription('Example command').toJSON()).not.toThrowError();
			});
		});

		describe('Builder with simple options', () => {
			test('GIVEN valid builder THEN returns type included', () => {
				expect(getNamedBuilder().toJSON()).includes({ type: ApplicationCommandType.ChatInput });
			});

			test('GIVEN valid builder with options THEN does not throw error', () => {
				expect(() =>
					getBuilder()
						.setName('example')
						.setDescription('Example command')
						.addBooleanOptions((boolean) =>
							boolean.setName('iscool').setDescription('Are we cool or what?').setRequired(true),
						)
						.addChannelOptions((channel) => channel.setName('iscool').setDescription('Are we cool or what?'))
						.addMentionableOptions((mentionable) =>
							mentionable.setName('iscool').setDescription('Are we cool or what?'),
						)
						.addRoleOptions((role) => role.setName('iscool').setDescription('Are we cool or what?'))
						.addUserOptions((user) => user.setName('iscool').setDescription('Are we cool or what?'))
						.addIntegerOptions((integer) =>
							integer
								.setName('iscool')
								.setDescription('Are we cool or what?')
								.addChoices({ name: 'Very cool', value: 1_000 })
								.addChoices([{ name: 'Even cooler', value: 2_000 }]),
						)
						.addNumberOptions((number) =>
							number
								.setName('iscool')
								.setDescription('Are we cool or what?')
								.addChoices({ name: 'Very cool', value: 1.5 })
								.addChoices([{ name: 'Even cooler', value: 2.5 }]),
						)
						.addStringOptions((string) =>
							string
								.setName('iscool')
								.setDescription('Are we cool or what?')
								.addChoices({ name: 'Fancy Pants', value: 'fp_1' }, { name: 'Fancy Shoes', value: 'fs_1' })
								.addChoices([{ name: 'The Whole shebang', value: 'all' }]),
						)
						.addIntegerOptions((integer) =>
							integer.setName('iscool').setDescription('Are we cool or what?').setAutocomplete(true),
						)
						.addNumberOptions((number) =>
							number.setName('iscool').setDescription('Are we cool or what?').setAutocomplete(true),
						)
						.addStringOptions((string) =>
							string.setName('iscool').setDescription('Are we cool or what?').setAutocomplete(true),
						)
						.toJSON(),
				).not.toThrowError();
			});

			test('GIVEN a builder with invalid autocomplete THEN does throw an error', () => {
				expect(() =>
					// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
					getNamedBuilder().addStringOptions(getStringOption().setAutocomplete('not a boolean')).toJSON(),
				).toThrowError();
			});

			test('GIVEN a builder with both choices and autocomplete THEN does throw an error', () => {
				expect(() =>
					getNamedBuilder()
						.addStringOptions(
							getStringOption().setAutocomplete(true).addChoices({ name: 'Fancy Pants', value: 'fp_1' }),
						)
						.toJSON(),
				).toThrowError();

				expect(() =>
					getNamedBuilder()
						.addStringOptions(
							getStringOption()
								.setAutocomplete(true)
								.addChoices(
									{ name: 'Fancy Pants', value: 'fp_1' },
									{ name: 'Fancy Shoes', value: 'fs_1' },
									{ name: 'The Whole shebang', value: 'all' },
								),
						)
						.toJSON(),
				).toThrowError();

				expect(() =>
					getNamedBuilder()
						.addStringOptions(
							getStringOption().addChoices({ name: 'Fancy Pants', value: 'fp_1' }).setAutocomplete(true),
						)
						.toJSON(),
				).toThrowError();
			});

			test('GIVEN a builder with valid channel options and channel_types THEN does not throw an error', () => {
				expect(() =>
					getNamedBuilder()
						.addChannelOptions(
							getChannelOption().addChannelTypes(ChannelType.GuildText).addChannelTypes([ChannelType.GuildVoice]),
						)
						.toJSON(),
				).not.toThrowError();

				expect(() => {
					getNamedBuilder()
						.addChannelOptions(getChannelOption().addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText))
						.toJSON();
				}).not.toThrowError();
			});

			test('GIVEN a builder with valid channel options and channel_types THEN does throw an error', () => {
				expect(() =>
					// @ts-expect-error: Invalid channel type
					getNamedBuilder().addChannelOptions(getChannelOption().addChannelTypes(100)).toJSON(),
				).toThrowError();

				expect(() =>
					// @ts-expect-error: Invalid channel types
					getNamedBuilder().addChannelOptions(getChannelOption().addChannelTypes(100, 200)).toJSON(),
				).toThrowError();
			});

			test('GIVEN a builder with invalid number min/max options THEN does throw an error', () => {
				// @ts-expect-error: Invalid max value
				expect(() => getNamedBuilder().addNumberOptions(getNumberOption().setMaxValue('test')).toJSON()).toThrowError();

				expect(() =>
					// @ts-expect-error: Invalid max value
					getNamedBuilder().addIntegerOptions(getIntegerOption().setMaxValue('test')).toJSON(),
				).toThrowError();

				// @ts-expect-error: Invalid min value
				expect(() => getNamedBuilder().addNumberOptions(getNumberOption().setMinValue('test')).toJSON()).toThrowError();

				expect(() =>
					// @ts-expect-error: Invalid min value
					getNamedBuilder().addIntegerOptions(getIntegerOption().setMinValue('test')).toJSON(),
				).toThrowError();

				expect(() => getNamedBuilder().addIntegerOptions(getIntegerOption().setMinValue(1.5)).toJSON()).toThrowError();
			});

			test('GIVEN a builder with valid number min/max options THEN does not throw an error', () => {
				expect(() =>
					getNamedBuilder().addIntegerOptions(getIntegerOption().setMinValue(1)).toJSON(),
				).not.toThrowError();

				expect(() =>
					getNamedBuilder().addNumberOptions(getNumberOption().setMinValue(1.5)).toJSON(),
				).not.toThrowError();

				expect(() =>
					getNamedBuilder().addIntegerOptions(getIntegerOption().setMaxValue(1)).toJSON(),
				).not.toThrowError();

				expect(() =>
					getNamedBuilder().addNumberOptions(getNumberOption().setMaxValue(1.5)).toJSON(),
				).not.toThrowError();
			});

			test('GIVEN an already built builder THEN does not throw an error', () => {
				expect(() => getNamedBuilder().addStringOptions(getStringOption()).toJSON()).not.toThrowError();

				expect(() => getNamedBuilder().addIntegerOptions(getIntegerOption()).toJSON()).not.toThrowError();

				expect(() => getNamedBuilder().addNumberOptions(getNumberOption()).toJSON()).not.toThrowError();

				expect(() => getNamedBuilder().addBooleanOptions(getBooleanOption()).toJSON()).not.toThrowError();

				expect(() => getNamedBuilder().addUserOptions(getUserOption()).toJSON()).not.toThrowError();

				expect(() => getNamedBuilder().addChannelOptions(getChannelOption()).toJSON()).not.toThrowError();

				expect(() => getNamedBuilder().addRoleOptions(getRoleOption()).toJSON()).not.toThrowError();

				expect(() => getNamedBuilder().addAttachmentOptions(getAttachmentOption()).toJSON()).not.toThrowError();

				expect(() => getNamedBuilder().addMentionableOptions(getMentionableOption()).toJSON()).not.toThrowError();
			});

			test('GIVEN invalid name THEN throw error', () => {
				expect(() => getBuilder().setName('TEST_COMMAND').setDescription(':3').toJSON()).toThrowError();
				expect(() => getBuilder().setName('ĂĂĂĂĂĂ').setDescription(':3').toJSON()).toThrowError();
			});

			test('GIVEN valid names THEN does not throw error', () => {
				expect(() => getBuilder().setName('hi_there').setDescription(':3')).not.toThrowError();
				expect(() => getBuilder().setName('o_comandă').setDescription(':3')).not.toThrowError();
				expect(() => getBuilder().setName('どうも').setDescription(':3')).not.toThrowError();
			});

			test('GIVEN invalid returns for builder THEN throw error', () => {
				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getNamedBuilder().addBooleanOptions(true).toJSON()).toThrowError();

				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getNamedBuilder().addBooleanOptions(null).toJSON()).toThrowError();

				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getNamedBuilder().addBooleanOptions(undefined).toJSON()).toThrowError();

				expect(() =>
					getNamedBuilder()
						// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
						.addBooleanOptions(() => ChatInputCommandStringOption)
						.toJSON(),
				).toThrowError();
				expect(() =>
					getNamedBuilder()
						// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
						.addBooleanOptions(() => new Collection())
						.toJSON(),
				).toThrowError();
			});

			test('GIVEN an option that is autocompletable and has choices, THEN passing nothing to setChoices should not throw an error', () => {
				expect(() =>
					getNamedBuilder().addStringOptions(getStringOption().setAutocomplete(true).setChoices()).toJSON(),
				).not.toThrowError();
			});

			test('GIVEN an option that is autocompletable, THEN setting choices should throw an error', () => {
				expect(() =>
					getNamedBuilder()
						.addStringOptions(getStringOption().setAutocomplete(true).setChoices({ name: 'owo', value: 'uwu' }))
						.toJSON(),
				).toThrowError();
			});

			test('GIVEN an option, THEN setting choices should not throw an error', () => {
				expect(() =>
					getNamedBuilder()
						.addStringOptions(getStringOption().setChoices({ name: 'owo', value: 'uwu' }))
						.toJSON(),
				).not.toThrowError();
			});

			test('GIVEN valid builder with NSFW, THEN does not throw error', () => {
				expect(() => getNamedBuilder().setName('foo').setDescription('foo').setNSFW(true).toJSON()).not.toThrowError();
			});
		});

		describe('Builder with subcommand (group) options', () => {
			test('GIVEN builder with subcommand group THEN does not throw error', () => {
				expect(() =>
					getNamedBuilder()
						.addSubcommandGroups((group) =>
							group.setName('group').setDescription('Group us together!').addSubcommands(getSubcommand()),
						)
						.toJSON(),
				).not.toThrowError();
			});

			test('GIVEN builder with subcommand THEN does not throw error', () => {
				expect(() =>
					getNamedBuilder()
						.addSubcommands((subcommand) => subcommand.setName('boop').setDescription('Boops a fellow nerd (you)'))
						.toJSON(),
				).not.toThrowError();
			});

			test('GIVEN builder with subcommand THEN has regular ChatInput command fields', () => {
				expect(() =>
					getBuilder()
						.setName('name')
						.setDescription('description')
						.addSubcommands((option) => option.setName('ye').setDescription('ye'))
						.addSubcommands((option) => option.setName('no').setDescription('no'))
						.setDefaultMemberPermissions(1n)
						.toJSON(),
				).not.toThrowError();
			});

			test('GIVEN builder with already built subcommand group THEN does not throw error', () => {
				expect(() =>
					getNamedBuilder().addSubcommandGroups(getSubcommandGroup().addSubcommands(getSubcommand())).toJSON(),
				).not.toThrowError();
			});

			test('GIVEN builder with already built subcommand THEN does not throw error', () => {
				expect(() => getNamedBuilder().addSubcommands(getSubcommand()).toJSON()).not.toThrowError();
			});

			test('GIVEN builder with already built subcommand with options THEN does not throw error', () => {
				expect(() =>
					getNamedBuilder().addSubcommands(getSubcommand().addBooleanOptions(getBooleanOption())).toJSON(),
				).not.toThrowError();
			});

			test('GIVEN builder with a subcommand that tries to add an invalid result THEN throw error', () => {
				expect(() =>
					// @ts-expect-error: Checking if check works JS-side too
					getNamedBuilder().addSubcommands(getSubcommand()).addIntegerOptions(getInteger()).toJSON(),
				).toThrowError();
			});

			test('GIVEN no valid return for an addSubcommand(Group) method THEN throw error', () => {
				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getNamedBuilder().addSubcommands(getSubcommandGroup()).toJSON()).toThrowError();
			});
		});

		describe('Subcommand group builder', () => {
			test('GIVEN no valid subcommand THEN throw error', () => {
				expect(() => getSubcommandGroup().addSubcommands().toJSON()).toThrowError();

				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getSubcommandGroup().addSubcommands(getSubcommandGroup()).toJSON()).toThrowError();
			});

			test('GIVEN a valid subcommand THEN does not throw an error', () => {
				expect(() =>
					getSubcommandGroup()
						.addSubcommands((sub) => sub.setName('sub').setDescription('Testing 123'))
						.toJSON(),
				).not.toThrowError();
			});
		});

		describe('Subcommand builder', () => {
			test('GIVEN a valid subcommand with options THEN does not throw error', () => {
				expect(() => getSubcommand().addBooleanOptions(getBooleanOption()).toJSON()).not.toThrowError();
			});
		});

		describe('ChatInput command localizations', () => {
			const expectedSingleLocale = { 'en-US': 'foobar' };
			const expectedMultipleLocales = {
				...expectedSingleLocale,
				bg: 'test',
			};

			test('GIVEN valid name localizations THEN does not throw error', () => {
				expect(() => getBuilder().setNameLocalization('en-US', 'foobar')).not.toThrowError();
				expect(() => getBuilder().setNameLocalizations({ 'en-US': 'foobar' })).not.toThrowError();
			});

			test('GIVEN invalid name localizations THEN does throw error', () => {
				// @ts-expect-error: Invalid localization
				expect(() => getNamedBuilder().setNameLocalization('en-U', 'foobar').toJSON()).toThrowError();
				// @ts-expect-error: Invalid localization
				expect(() => getNamedBuilder().setNameLocalizations({ 'en-U': 'foobar' }).toJSON()).toThrowError();
			});

			test('GIVEN valid name localizations THEN valid data is stored', () => {
				expect(getNamedBuilder().setNameLocalization('en-US', 'foobar').toJSON().name_localizations).toEqual(
					expectedSingleLocale,
				);
				expect(
					getNamedBuilder().setNameLocalizations({ 'en-US': 'foobar', bg: 'test' }).toJSON().name_localizations,
				).toEqual(expectedMultipleLocales);
				expect(getNamedBuilder().clearNameLocalizations().toJSON().name_localizations).toBeUndefined();
				expect(getNamedBuilder().clearNameLocalization('en-US').toJSON().name_localizations).toEqual({
					'en-US': undefined,
				});
			});

			test('GIVEN valid description localizations THEN does not throw error', () => {
				expect(() => getNamedBuilder().setDescriptionLocalization('en-US', 'foobar').toJSON()).not.toThrowError();
				expect(() => getNamedBuilder().setDescriptionLocalizations({ 'en-US': 'foobar' }).toJSON()).not.toThrowError();
			});

			test('GIVEN invalid description localizations THEN does throw error', () => {
				// @ts-expect-error: Invalid localization description
				expect(() => getNamedBuilder().setDescriptionLocalization('en-U', 'foobar').toJSON()).toThrowError();
				// @ts-expect-error: Invalid localization description
				expect(() => getNamedBuilder().setDescriptionLocalizations({ 'en-U': 'foobar' }).toJSON()).toThrowError();
			});

			test('GIVEN valid description localizations THEN valid data is stored', () => {
				expect(
					getNamedBuilder().setDescriptionLocalization('en-US', 'foobar').toJSON(false).description_localizations,
				).toEqual(expectedSingleLocale);
				expect(
					getNamedBuilder().setDescriptionLocalizations({ 'en-US': 'foobar', bg: 'test' }).toJSON(false)
						.description_localizations,
				).toEqual(expectedMultipleLocales);
				expect(
					getNamedBuilder().clearDescriptionLocalizations().toJSON(false).description_localizations,
				).toBeUndefined();
				expect(getNamedBuilder().clearDescriptionLocalization('en-US').toJSON(false).description_localizations).toEqual(
					{
						'en-US': undefined,
					},
				);
			});
		});

		describe('permissions', () => {
			test('GIVEN valid permission string THEN does not throw error', () => {
				expect(() => getNamedBuilder().setDefaultMemberPermissions('1')).not.toThrowError();
			});

			test('GIVEN valid permission bitfield THEN does not throw error', () => {
				expect(() =>
					getNamedBuilder().setDefaultMemberPermissions(
						PermissionFlagsBits.AddReactions | PermissionFlagsBits.AttachFiles,
					),
				).not.toThrowError();
			});

			test('GIVEN null permissions THEN does not throw error', () => {
				expect(() => getNamedBuilder().clearDefaultMemberPermissions()).not.toThrowError();
			});

			test('GIVEN invalid inputs THEN does throw error', () => {
				expect(() => getNamedBuilder().setDefaultMemberPermissions('1.1').toJSON()).toThrowError();
				expect(() => getNamedBuilder().setDefaultMemberPermissions(1.1).toJSON()).toThrowError();
			});

			test('GIVEN valid permission with options THEN does not throw error', () => {
				expect(() =>
					getNamedBuilder().addBooleanOptions(getBooleanOption()).setDefaultMemberPermissions('1').toJSON(),
				).not.toThrowError();

				expect(() => getNamedBuilder().addChannelOptions(getChannelOption())).not.toThrowError();
			});
		});

		describe('contexts', () => {
			test('GIVEN a builder with valid contexts THEN does not throw an error', () => {
				expect(() =>
					getNamedBuilder().setContexts([InteractionContextType.Guild, InteractionContextType.BotDM]).toJSON(),
				).not.toThrowError();

				expect(() =>
					getNamedBuilder().setContexts(InteractionContextType.Guild, InteractionContextType.BotDM).toJSON(),
				).not.toThrowError();
			});

			test('GIVEN a builder with invalid contexts THEN does throw an error', () => {
				// @ts-expect-error: Invalid contexts
				expect(() => getNamedBuilder().setContexts(999).toJSON()).toThrowError();

				// @ts-expect-error: Invalid contexts
				expect(() => getNamedBuilder().setContexts([999, 998]).toJSON()).toThrowError();
			});
		});

		describe('integration types', () => {
			test('GIVEN a builder with valid integraton types THEN does not throw an error', () => {
				expect(() =>
					getNamedBuilder()
						.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
						.toJSON(),
				).not.toThrowError();

				expect(() =>
					getNamedBuilder()
						.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
						.toJSON(),
				).not.toThrowError();
			});

			test('GIVEN a builder with invalid integration types THEN does throw an error', () => {
				// @ts-expect-error: Invalid integration types
				expect(() => getNamedBuilder().setIntegrationTypes(999).toJSON()).toThrowError();

				// @ts-expect-error: Invalid integration types
				expect(() => getNamedBuilder().setIntegrationTypes([999, 998]).toJSON()).toThrowError();
			});
		});
	});
});
