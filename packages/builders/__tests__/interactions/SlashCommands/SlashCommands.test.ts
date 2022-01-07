import { APIApplicationCommandOptionChoice, ChannelType } from 'discord-api-types/v9';
import {
	SlashCommandAssertions,
	SlashCommandBooleanOption,
	SlashCommandBuilder,
	SlashCommandChannelOption,
	SlashCommandIntegerOption,
	SlashCommandMentionableOption,
	SlashCommandNumberOption,
	SlashCommandRoleOption,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	SlashCommandUserOption,
} from '../../../src/index';

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
const getMentionableOption = () => new SlashCommandMentionableOption().setName('owo').setDescription('Testing 123');
const getSubcommandGroup = () => new SlashCommandSubcommandGroupBuilder().setName('owo').setDescription('Testing 123');
const getSubcommand = () => new SlashCommandSubcommandBuilder().setName('owo').setDescription('Testing 123');

class Collection {
	public get [Symbol.toStringTag]() {
		return 'Map';
	}
}

describe('Slash Commands', () => {
	describe('Assertions tests', () => {
		test('GIVEN valid name THEN does not throw error', () => {
			expect(() => SlashCommandAssertions.validateName('ping')).not.toThrowError();
		});

		test('GIVEN invalid name THEN throw error', () => {
			expect(() => SlashCommandAssertions.validateName(null)).toThrowError();

			// Too short of a name
			expect(() => SlashCommandAssertions.validateName('')).toThrowError();

			// Invalid characters used
			expect(() => SlashCommandAssertions.validateName('ABC123$%^&')).toThrowError();

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

			expect(() => SlashCommandAssertions.validateMaxChoicesLength([])).not.toThrowError();
		});

		test('GIVEN invalid options or choices THEN throw error', () => {
			expect(() => SlashCommandAssertions.validateMaxOptionsLength(null)).toThrowError();

			expect(() => SlashCommandAssertions.validateMaxChoicesLength(null)).toThrowError();

			// Given an array that's too big
			expect(() => SlashCommandAssertions.validateMaxOptionsLength(largeArray)).toThrowError();

			expect(() => SlashCommandAssertions.validateMaxChoicesLength(largeArray)).toThrowError();
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
								.addChoices([['Very cool', 1_000]]),
						)
						.addNumberOption((number) =>
							number
								.setName('iscool')
								.setDescription('Are we cool or what?')
								.addChoices([['Very cool', 1.5]]),
						)
						.addStringOption((string) =>
							string
								.setName('iscool')
								.setDescription('Are we cool or what?')
								.addChoices([
									['Fancy Pants', 'fp_1'],
									['Fancy Shoes', 'fs_1'],
									['The Whole shebang', 'all'],
								]),
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
				// @ts-expect-error Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addStringOption(getStringOption().setAutocomplete('not a boolean'))).toThrowError();
			});

			test('GIVEN a builder with both choices and autocomplete THEN does throw an error', () => {
				expect(() =>
					getBuilder().addStringOption(
						// @ts-expect-error Checking if check works JS-side too
						// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
						getStringOption().setAutocomplete(true).addChoice('Fancy Pants', 'fp_1'),
					),
				).toThrowError();

				expect(() =>
					getBuilder().addStringOption(
						// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
						getStringOption()
							.setAutocomplete(true)
							// @ts-expect-error Checking if check works JS-side too
							.addChoices([
								['Fancy Pants', 'fp_1'],
								['Fancy Shoes', 'fs_1'],
								['The Whole shebang', 'all'],
							]),
					),
				).toThrowError();

				expect(() =>
					getBuilder().addStringOption(
						// @ts-expect-error Checking if check works JS-side too
						// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
						getStringOption().addChoice('Fancy Pants', 'fp_1').setAutocomplete(true),
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
					getBuilder().addChannelOption(getChannelOption().addChannelType(ChannelType.GuildText)),
				).not.toThrowError();

				expect(() => {
					getBuilder().addChannelOption(
						getChannelOption().addChannelTypes([ChannelType.GuildNews, ChannelType.GuildText]),
					);
				}).not.toThrowError();
			});

			test('GIVEN a builder with valid channel options and channel_types THEN does throw an error', () => {
				expect(() => getBuilder().addChannelOption(getChannelOption().addChannelType(100))).toThrowError();

				expect(() => getBuilder().addChannelOption(getChannelOption().addChannelTypes([100, 200]))).toThrowError();
			});

			test('GIVEN a builder with invalid number min/max options THEN does throw an error', () => {
				// @ts-expect-error
				expect(() => getBuilder().addNumberOption(getNumberOption().setMaxValue('test'))).toThrowError();

				// @ts-expect-error
				expect(() => getBuilder().addIntegerOption(getIntegerOption().setMaxValue('test'))).toThrowError();

				// @ts-expect-error
				expect(() => getBuilder().addNumberOption(getNumberOption().setMinValue('test'))).toThrowError();

				// @ts-expect-error
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

				expect(() => getBuilder().addMentionableOption(getMentionableOption())).not.toThrowError();
			});

			test('GIVEN no valid return for an addOption method THEN throw error', () => {
				// @ts-expect-error Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addBooleanOption()).toThrowError();

				// @ts-expect-error Checking if not providing anything, or an invalid return type causes an error
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
				// @ts-expect-error Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addBooleanOption(true)).toThrowError();

				expect(() => getBuilder().addBooleanOption(null)).toThrowError();

				expect(() => getBuilder().addBooleanOption(undefined)).toThrowError();

				// @ts-expect-error Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addBooleanOption(() => SlashCommandStringOption)).toThrowError();
				// @ts-expect-error Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addBooleanOption(() => new Collection())).toThrowError();
			});

			test('GIVEN valid builder with defaultPermission false THEN does not throw error', () => {
				expect(() => getBuilder().setName('foo').setDescription('foo').setDefaultPermission(false)).not.toThrowError();
			});

			test('GIVEN an option that is autocompletable and has choices, THEN setting choices to an empty array should not throw an error', () => {
				expect(() =>
					getBuilder().addStringOption(getStringOption().setAutocomplete(true).setChoices([])),
				).not.toThrowError();
			});

			test('GIVEN an option that is autocompletable, THEN setting choices should throw an error', () => {
				expect(() =>
					getBuilder().addStringOption(
						getStringOption()
							.setAutocomplete(true)
							.setChoices([['owo', 'uwu']]),
					),
				).toThrowError();
			});

			test('GIVEN an option, THEN setting choices should not throw an error', () => {
				expect(() => getBuilder().addStringOption(getStringOption().setChoices([['owo', 'uwu']]))).not.toThrowError();
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
					// @ts-expect-error Checking if check works JS-side too
					getNamedBuilder().addSubcommand(getSubcommand()).addInteger(getInteger()),
				).toThrowError();
			});

			test('GIVEN no valid return for an addSubcommand(Group) method THEN throw error', () => {
				// @ts-expect-error Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addSubcommandGroup()).toThrowError();

				// @ts-expect-error Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addSubcommand()).toThrowError();

				// @ts-expect-error Checking if not providing anything, or an invalid return type causes an error
				expect(() => getBuilder().addSubcommand(getSubcommandGroup())).toThrowError();
			});
		});

		describe('Subcommand group builder', () => {
			test('GIVEN no valid subcommand THEN throw error', () => {
				// @ts-expect-error Checking if not providing anything, or an invalid return type causes an error
				expect(() => getSubcommandGroup().addSubcommand()).toThrowError();

				// @ts-expect-error Checking if not providing anything, or an invalid return type causes an error
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
	});
});
