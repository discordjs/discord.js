import { ChannelType, PermissionFlagsBits, type APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	SlashCommandAssertions,
	SlashCommandBooleanOption,
	SlashCommandBuilder,
	SlashCommandChannelOption,
	SlashCommandIntegerOption,
	SlashCommandMentionableOption,
	SlashCommandNumberOption,
	SlashCommandRoleOption,
	SlashCommandAttachmentOption,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	SlashCommandUserOption,
} from '../../../src/index.js';

const largeArray = Array.from({ length: 26 }, () => 1 as unknown as APIApplicationCommandOptionChoice);

const getBuilder = () => new SlashCommandBuilder();
const getNamedBuilder = () => getBuilder().setName('example').setDescription('Example command');
const getStringOption = () => new SlashCommandStringOption().setName('owo').setDescription('Testing 123');
const getIntegerOption = () => new SlashCommandIntegerOption().setName('owo').setDescription('Testing 123');
const getNumberOption = () => new SlashCommandNumberOption().setName('owo').setDescription('Testing 123');
const getBooleanOption = () => new SlashCommandBooleanOption().setName('owo').setDescription('Testing 123');
const getUserOption = () => new SlashCommandUserOption().setName('owo').setDescription('Testing 123');
const getChannelOption = () => new SlashCommandChannelOption().setName('owo').setDescription('Testing 123');
const getRoleOption = () => new SlashCommandRoleOption().setName('owo').setDescription('Testing 123');
const getAttachmentOption = () => new SlashCommandAttachmentOption().setName('owo').setDescription('Testing 123');
const getMentionableOption = () => new SlashCommandMentionableOption().setName('owo').setDescription('Testing 123');
const getSubcommandGroup = () => new SlashCommandSubcommandGroupBuilder().setName('owo').setDescription('Testing 123');
const getSubcommand = () => new SlashCommandSubcommandBuilder().setName('owo').setDescription('Testing 123');

class Collection {
	public readonly [Symbol.toStringTag] = 'Map';
}

describe('Slash Commands', () => {
	describe('Assertions tests', () => {
		test('GIVEN valid name THEN does not throw error', () => {
			expect(() => SlashCommandAssertions.validateName('ping')).not.toThrowError();
			expect(() => SlashCommandAssertions.validateName('hello-world_command')).not.toThrowError();
			expect(() => SlashCommandAssertions.validateName('aˇ㐆1٢〣²अก')).not.toThrowError();
		});

		test('GIVEN invalid name THEN throw error', () => {
			expect(() => SlashCommandAssertions.validateName(null)).toThrowError();

			// Too short of a name
			expect(() => SlashCommandAssertions.validateName('')).toThrowError();

			// Invalid characters used
			expect(() => SlashCommandAssertions.validateName('ABC')).toThrowError();
			expect(() => SlashCommandAssertions.validateName('ABC123$%^&')).toThrowError();
			expect(() => SlashCommandAssertions.validateName('help ping')).toThrowError();
			expect(() => SlashCommandAssertions.validateName('🦦')).toThrowError();

			// Too long of a name
			expect(() =>
				SlashCommandAssertions.validateName('qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm'),
			).toThrowError();
		});

		test('GIVEN valid description THEN does not throw error', () => {
			expect(() => SlashCommandAssertions.validateDescription('This is an OwO moment fur sure!~')).not.toThrowError();
		});

		test('GIVEN invalid description THEN throw error', () => {
			expect(() => SlashCommandAssertions.validateDescription(null)).toThrowError();

			// Too short of a description
			expect(() => SlashCommandAssertions.validateDescription('')).toThrowError();

			// Too long of a description
			expect(() =>
				SlashCommandAssertions.validateDescription(
					'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam autem libero expedita vitae accusamus nostrum ipsam tempore repudiandae deserunt ipsum facilis, velit fugiat facere accusantium, explicabo corporis aliquam non quos.',
				),
			).toThrowError();
		});

		test('GIVEN valid default_permission THEN does not throw error', () => {
			expect(() => SlashCommandAssertions.validateDefaultPermission(true)).not.toThrowError();
		});

		test('GIVEN invalid default_permission THEN throw error', () => {
			expect(() => SlashCommandAssertions.validateDefaultPermission(null)).toThrowError();
		});

		test('GIVEN valid array of options or choices THEN does not throw error', () => {
			expect(() => SlashCommandAssertions.validateMaxOptionsLength([])).not.toThrowError();

			expect(() => SlashCommandAssertions.validateChoicesLength(25)).not.toThrowError();
			expect(() => SlashCommandAssertions.validateChoicesLength(25, [])).not.toThrowError();
		});

		test('GIVEN invalid options or choices THEN throw error', () => {
			expect(() => SlashCommandAssertions.validateMaxOptionsLength(null)).toThrowError();

			// Given an array that's too big
			expect(() => SlashCommandAssertions.validateMaxOptionsLength(largeArray)).toThrowError();

			expect(() => SlashCommandAssertions.validateChoicesLength(1, largeArray)).toThrowError();
		});

		test('GIVEN valid required parameters THEN does not throw error', () => {
			expect(() =>
				SlashCommandAssertions.validateRequiredParameters(
					'owo',
					'My fancy command that totally exists, to test assertions',
					[],
				),
			).not.toThrowError();
		});

		test('GIVEN missing required parameters THEN throw error', () => {
			expect(() => SlashCommandAssertions.validateRequiredParameters(null, 'My name is missing', [])).toThrowError(
				'Required parameter "name" is missing',
			);

			expect(() =>
				SlashCommandAssertions.validateRequiredParameters('my-description-is-missing', null, []),
			).toThrowError('Required parameter "description" is missing');
		});
	});

	describe('SlashCommandBuilder', () => {
		describe('Builder with no options', () => {
			test('GIVEN empty builder THEN throw error when calling toJSON', () => {
				expect(() => getBuilder().toJSON()).toThrowError();
			});

			test('GIVEN valid builder THEN does not throw error', () => {
				expect(() => getBuilder().setName('example').setDescription('Example command').toJSON()).not.toThrowError();
			});
		});

		describe('Builder with simple options', () => {
			test('GIVEN valid builder with options THEN does not throw error', () => {
				expect(() =>
					getBuilder()
						.setName('example')
						.setDescription('Example command')
						.setDMPermission(false)
						.addBooleanOption((boolean) =>
							boolean.setName('iscool').setDescription('Are we cool or what?').setRequired(true),
						)
						.addChannelOption((channel) => channel.setName('iscool').setDescription('Are we cool or what?'))
						.addMentionableOption((mentionable) => mentionable.setName('iscool').setDescription('Are we cool or what?'))
						.addRoleOption((role) => role.setName('iscool').setDescription('Are we cool or what?'))
						.addUserOption((user) => user.setName('iscool').setDescription('Are we cool or what?'))
						.addIntegerOption((integer) =>
							integer
								.setName('iscool')
								.setDescription('Are we cool or what?')
								.addChoices({ name: 'Very cool', value: 1_000 }),
						)
						.addNumberOption((number) =>
							number
								.setName('iscool')
								.setDescription('Are we cool or what?')
								.addChoices({ name: 'Very cool', value: 1.5 }),
						)
						.addStringOption((string) =>
							string
								.setName('iscool')
								.setDescription('Are we cool or what?')
								.addChoices(
									{ name: 'Fancy Pants', value: 'fp_1' },
									{ name: 'Fancy Shoes', value: 'fs_1' },
									{ name: 'The Whole shebang', value: 'all' },
								),
						)
						.addIntegerOption((integer) =>
							integer.setName('iscool').setDescription('Are we cool or what?').setAutocomplete(true),
						)
						.addNumberOption((number) =>
							number.setName('iscool').setDescription('Are we cool or what?').setAutocomplete(true),
						)
						.addStringOption((string) =>
							string.setName('iscool').setDescription('Are we cool or what?').setAutocomplete(true),
						)
						.toJSON(),
				).not.toThrowError();
			});

			test('GIVEN a builder with invalid autocomplete THEN does throw an error', () => {
				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addStringOption(getStringOption().setAutocomplete('not a boolean'))).toThrowError();
			});

			test('GIVEN a builder with both choices and autocomplete THEN does throw an error', () => {
				expect(() =>
					getBuilder().addStringOption(
						getStringOption().setAutocomplete(true).addChoices({ name: 'Fancy Pants', value: 'fp_1' }),
					),
				).toThrowError();

				expect(() =>
					getBuilder().addStringOption(
						getStringOption()
							.setAutocomplete(true)
							.addChoices(
								{ name: 'Fancy Pants', value: 'fp_1' },
								{ name: 'Fancy Shoes', value: 'fs_1' },
								{ name: 'The Whole shebang', value: 'all' },
							),
					),
				).toThrowError();

				expect(() =>
					getBuilder().addStringOption(
						getStringOption().addChoices({ name: 'Fancy Pants', value: 'fp_1' }).setAutocomplete(true),
					),
				).toThrowError();

				expect(() => {
					const option = getStringOption();
					Reflect.set(option, 'autocomplete', true);
					Reflect.set(option, 'choices', [{ name: 'Fancy Pants', value: 'fp_1' }]);
					return option.toJSON();
				}).toThrowError();

				expect(() => {
					const option = getNumberOption();
					Reflect.set(option, 'autocomplete', true);
					Reflect.set(option, 'choices', [{ name: 'Fancy Pants', value: 'fp_1' }]);
					return option.toJSON();
				}).toThrowError();

				expect(() => {
					const option = getIntegerOption();
					Reflect.set(option, 'autocomplete', true);
					Reflect.set(option, 'choices', [{ name: 'Fancy Pants', value: 'fp_1' }]);
					return option.toJSON();
				}).toThrowError();
			});

			test('GIVEN a builder with valid channel options and channel_types THEN does not throw an error', () => {
				expect(() =>
					getBuilder().addChannelOption(getChannelOption().addChannelTypes(ChannelType.GuildText)),
				).not.toThrowError();

				expect(() => {
					getBuilder().addChannelOption(
						getChannelOption().addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText),
					);
				}).not.toThrowError();
			});

			test('GIVEN a builder with valid channel options and channel_types THEN does throw an error', () => {
				expect(() => getBuilder().addChannelOption(getChannelOption().addChannelTypes(100))).toThrowError();

				expect(() => getBuilder().addChannelOption(getChannelOption().addChannelTypes(100, 200))).toThrowError();
			});

			test('GIVEN a builder with invalid number min/max options THEN does throw an error', () => {
				// @ts-expect-error: Invalid max value
				expect(() => getBuilder().addNumberOption(getNumberOption().setMaxValue('test'))).toThrowError();

				// @ts-expect-error: Invalid max value
				expect(() => getBuilder().addIntegerOption(getIntegerOption().setMaxValue('test'))).toThrowError();

				// @ts-expect-error: Invalid min value
				expect(() => getBuilder().addNumberOption(getNumberOption().setMinValue('test'))).toThrowError();

				// @ts-expect-error: Invalid min value
				expect(() => getBuilder().addIntegerOption(getIntegerOption().setMinValue('test'))).toThrowError();

				expect(() => getBuilder().addIntegerOption(getIntegerOption().setMinValue(1.5))).toThrowError();
			});

			test('GIVEN a builder with valid number min/max options THEN does not throw an error', () => {
				expect(() => getBuilder().addIntegerOption(getIntegerOption().setMinValue(1))).not.toThrowError();

				expect(() => getBuilder().addNumberOption(getNumberOption().setMinValue(1.5))).not.toThrowError();

				expect(() => getBuilder().addIntegerOption(getIntegerOption().setMaxValue(1))).not.toThrowError();

				expect(() => getBuilder().addNumberOption(getNumberOption().setMaxValue(1.5))).not.toThrowError();
			});

			test('GIVEN an already built builder THEN does not throw an error', () => {
				expect(() => getBuilder().addStringOption(getStringOption())).not.toThrowError();

				expect(() => getBuilder().addIntegerOption(getIntegerOption())).not.toThrowError();

				expect(() => getBuilder().addNumberOption(getNumberOption())).not.toThrowError();

				expect(() => getBuilder().addBooleanOption(getBooleanOption())).not.toThrowError();

				expect(() => getBuilder().addUserOption(getUserOption())).not.toThrowError();

				expect(() => getBuilder().addChannelOption(getChannelOption())).not.toThrowError();

				expect(() => getBuilder().addRoleOption(getRoleOption())).not.toThrowError();

				expect(() => getBuilder().addAttachmentOption(getAttachmentOption())).not.toThrowError();

				expect(() => getBuilder().addMentionableOption(getMentionableOption())).not.toThrowError();
			});

			test('GIVEN no valid return for an addOption method THEN throw error', () => {
				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addBooleanOption()).toThrowError();

				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addBooleanOption(getRoleOption())).toThrowError();
			});

			test('GIVEN invalid name THEN throw error', () => {
				expect(() => getBuilder().setName('TEST_COMMAND')).toThrowError();

				expect(() => getBuilder().setName('ĂĂĂĂĂĂ')).toThrowError();
			});

			test('GIVEN valid names THEN does not throw error', () => {
				expect(() => getBuilder().setName('hi_there')).not.toThrowError();

				// Translation: a_command
				expect(() => getBuilder().setName('o_comandă')).not.toThrowError();

				// Translation: thx (according to GTranslate)
				expect(() => getBuilder().setName('どうも')).not.toThrowError();
			});

			test('GIVEN invalid returns for builder THEN throw error', () => {
				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addBooleanOption(true)).toThrowError();

				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addBooleanOption(null)).toThrowError();

				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addBooleanOption(undefined)).toThrowError();

				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addBooleanOption(() => SlashCommandStringOption)).toThrowError();
				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addBooleanOption(() => new Collection())).toThrowError();
			});

			test('GIVEN valid builder with defaultPermission false THEN does not throw error', () => {
				expect(() => getBuilder().setName('foo').setDescription('foo').setDefaultPermission(false)).not.toThrowError();
			});

			test('GIVEN an option that is autocompletable and has choices, THEN passing nothing to setChoices should not throw an error', () => {
				expect(() =>
					getBuilder().addStringOption(getStringOption().setAutocomplete(true).setChoices()),
				).not.toThrowError();
			});

			test('GIVEN an option that is autocompletable, THEN setting choices should throw an error', () => {
				expect(() =>
					getBuilder().addStringOption(
						getStringOption().setAutocomplete(true).setChoices({ name: 'owo', value: 'uwu' }),
					),
				).toThrowError();
			});

			test('GIVEN an option, THEN setting choices should not throw an error', () => {
				expect(() =>
					getBuilder().addStringOption(getStringOption().setChoices({ name: 'owo', value: 'uwu' })),
				).not.toThrowError();
			});
		});

		describe('Builder with subcommand (group) options', () => {
			test('GIVEN builder with subcommand group THEN does not throw error', () => {
				expect(() =>
					getNamedBuilder().addSubcommandGroup((group) => group.setName('group').setDescription('Group us together!')),
				).not.toThrowError();
			});

			test('GIVEN builder with subcommand THEN does not throw error', () => {
				expect(() =>
					getNamedBuilder().addSubcommand((subcommand) =>
						subcommand.setName('boop').setDescription('Boops a fellow nerd (you)'),
					),
				).not.toThrowError();
			});

			test('GIVEN builder with subcommand THEN has regular slash command fields', () => {
				expect(() =>
					getBuilder()
						.setName('name')
						.setDescription('description')
						.addSubcommand((option) => option.setName('ye').setDescription('ye'))
						.addSubcommand((option) => option.setName('no').setDescription('no'))
						.setDMPermission(false)
						.setDefaultMemberPermissions(1n),
				).not.toThrowError();
			});

			test('GIVEN builder with already built subcommand group THEN does not throw error', () => {
				expect(() => getNamedBuilder().addSubcommandGroup(getSubcommandGroup())).not.toThrowError();
			});

			test('GIVEN builder with already built subcommand THEN does not throw error', () => {
				expect(() => getNamedBuilder().addSubcommand(getSubcommand())).not.toThrowError();
			});

			test('GIVEN builder with already built subcommand with options THEN does not throw error', () => {
				expect(() =>
					getNamedBuilder().addSubcommand(getSubcommand().addBooleanOption(getBooleanOption())),
				).not.toThrowError();
			});

			test('GIVEN builder with a subcommand that tries to add an invalid result THEN throw error', () => {
				expect(() =>
					// @ts-expect-error: Checking if check works JS-side too
					getNamedBuilder().addSubcommand(getSubcommand()).addInteger(getInteger()),
				).toThrowError();
			});

			test('GIVEN no valid return for an addSubcommand(Group) method THEN throw error', () => {
				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addSubcommandGroup()).toThrowError();

				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addSubcommand()).toThrowError();

				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addSubcommand(getSubcommandGroup())).toThrowError();
			});
		});

		describe('Subcommand group builder', () => {
			test('GIVEN no valid subcommand THEN throw error', () => {
				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getSubcommandGroup().addSubcommand()).toThrowError();

				// @ts-expect-error: Checking if not providing anything, or an invalid return type causes an error
				expect(() => getSubcommandGroup().addSubcommand(getSubcommandGroup())).toThrowError();
			});

			test('GIVEN a valid subcommand THEN does not throw an error', () => {
				expect(() =>
					getSubcommandGroup()
						.addSubcommand((sub) => sub.setName('sub').setDescription('Testing 123'))
						.toJSON(),
				).not.toThrowError();
			});
		});

		describe('Subcommand builder', () => {
			test('GIVEN a valid subcommand with options THEN does not throw error', () => {
				expect(() => getSubcommand().addBooleanOption(getBooleanOption()).toJSON()).not.toThrowError();
			});
		});

		describe('Slash command localizations', () => {
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
				expect(() => getBuilder().setNameLocalization('en-U', 'foobar')).toThrowError();
				// @ts-expect-error: Invalid localization
				expect(() => getBuilder().setNameLocalizations({ 'en-U': 'foobar' })).toThrowError();
			});

			test('GIVEN valid name localizations THEN valid data is stored', () => {
				expect(getBuilder().setNameLocalization('en-US', 'foobar').name_localizations).toEqual(expectedSingleLocale);
				expect(getBuilder().setNameLocalizations({ 'en-US': 'foobar', bg: 'test' }).name_localizations).toEqual(
					expectedMultipleLocales,
				);
				expect(getBuilder().setNameLocalizations(null).name_localizations).toBeNull();
				expect(getBuilder().setNameLocalization('en-US', null).name_localizations).toEqual({
					'en-US': null,
				});
			});

			test('GIVEN valid description localizations THEN does not throw error', () => {
				expect(() => getBuilder().setDescriptionLocalization('en-US', 'foobar')).not.toThrowError();
				expect(() => getBuilder().setDescriptionLocalizations({ 'en-US': 'foobar' })).not.toThrowError();
			});

			test('GIVEN invalid description localizations THEN does throw error', () => {
				// @ts-expect-error: Invalid localization description
				expect(() => getBuilder().setDescriptionLocalization('en-U', 'foobar')).toThrowError();
				// @ts-expect-error: Invalid localization description
				expect(() => getBuilder().setDescriptionLocalizations({ 'en-U': 'foobar' })).toThrowError();
			});

			test('GIVEN valid description localizations THEN valid data is stored', () => {
				expect(getBuilder().setDescriptionLocalization('en-US', 'foobar').description_localizations).toEqual(
					expectedSingleLocale,
				);
				expect(
					getBuilder().setDescriptionLocalizations({ 'en-US': 'foobar', bg: 'test' }).description_localizations,
				).toEqual(expectedMultipleLocales);
				expect(getBuilder().setDescriptionLocalizations(null).description_localizations).toBeNull();
				expect(getBuilder().setDescriptionLocalization('en-US', null).description_localizations).toEqual({
					'en-US': null,
				});
			});
		});

		describe('permissions', () => {
			test('GIVEN valid permission string THEN does not throw error', () => {
				expect(() => getBuilder().setDefaultMemberPermissions('1')).not.toThrowError();
			});

			test('GIVEN valid permission bitfield THEN does not throw error', () => {
				expect(() =>
					getBuilder().setDefaultMemberPermissions(PermissionFlagsBits.AddReactions | PermissionFlagsBits.AttachFiles),
				).not.toThrowError();
			});

			test('GIVEN null permissions THEN does not throw error', () => {
				expect(() => getBuilder().setDefaultMemberPermissions(null)).not.toThrowError();
			});

			test('GIVEN invalid inputs THEN does throw error', () => {
				expect(() => getBuilder().setDefaultMemberPermissions('1.1')).toThrowError();

				expect(() => getBuilder().setDefaultMemberPermissions(1.1)).toThrowError();
			});
		});
	});
});
