import { PermissionFlagsBits } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { ContextMenuCommandAssertions, ContextMenuCommandBuilder } from '../../src/index.js';

const getBuilder = () => new ContextMenuCommandBuilder();

describe('Context Menu Commands', () => {
	describe('Assertions tests', () => {
		test('GIVEN valid name THEN does not throw error', () => {
			expect(() => ContextMenuCommandAssertions.validateName('ping')).not.toThrowError();
		});

		test('GIVEN invalid name THEN throw error', () => {
			expect(() => ContextMenuCommandAssertions.validateName(null)).toThrowError();

			// Too short of a name
			expect(() => ContextMenuCommandAssertions.validateName('')).toThrowError();

			// Invalid characters used
			expect(() => ContextMenuCommandAssertions.validateName('ABC123$%^&')).toThrowError();

			// Too long of a name
			expect(() =>
				ContextMenuCommandAssertions.validateName('qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm'),
			).toThrowError();
		});

		test('GIVEN valid type THEN does not throw error', () => {
			expect(() => ContextMenuCommandAssertions.validateType(3)).not.toThrowError();
		});

		test('GIVEN invalid type THEN throw error', () => {
			expect(() => ContextMenuCommandAssertions.validateType(null)).toThrowError();

			// Out of range
			expect(() => ContextMenuCommandAssertions.validateType(1)).toThrowError();
		});

		test('GIVEN valid required parameters THEN does not throw error', () => {
			expect(() => ContextMenuCommandAssertions.validateRequiredParameters('owo', 2)).not.toThrowError();
		});

		test('GIVEN valid default_permission THEN does not throw error', () => {
			expect(() => ContextMenuCommandAssertions.validateDefaultPermission(true)).not.toThrowError();
		});

		test('GIVEN invalid default_permission THEN throw error', () => {
			expect(() => ContextMenuCommandAssertions.validateDefaultPermission(null)).toThrowError();
		});
	});

	describe('ContextMenuCommandBuilder', () => {
		describe('Builder tests', () => {
			test('GIVEN empty builder THEN throw error when calling toJSON', () => {
				expect(() => getBuilder().toJSON()).toThrowError();
			});

			test('GIVEN valid builder THEN does not throw error', () => {
				expect(() => getBuilder().setName('example').setType(3).toJSON()).not.toThrowError();
			});

			test('GIVEN invalid name THEN throw error', () => {
				expect(() => getBuilder().setName('$$$')).toThrowError();

				expect(() => getBuilder().setName(' ')).toThrowError();
			});

			test('GIVEN valid names THEN does not throw error', () => {
				expect(() => getBuilder().setName('hi_there')).not.toThrowError();

				expect(() => getBuilder().setName('A COMMAND')).not.toThrowError();

				// Translation: a_command
				expect(() => getBuilder().setName('o_comandă')).not.toThrowError();

				// Translation: thx (according to GTranslate)
				expect(() => getBuilder().setName('どうも')).not.toThrowError();
			});

			test('GIVEN valid types THEN does not throw error', () => {
				expect(() => getBuilder().setType(2)).not.toThrowError();

				expect(() => getBuilder().setType(3)).not.toThrowError();
			});

			test('GIVEN valid builder with defaultPermission false THEN does not throw error', () => {
				expect(() => getBuilder().setName('foo').setDefaultPermission(false)).not.toThrowError();
			});

			test('GIVEN valid builder with dmPermission false THEN does not throw error', () => {
				expect(() => getBuilder().setName('foo').setDMPermission(false)).not.toThrowError();
			});
		});

		describe('Context menu command localizations', () => {
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
				// @ts-expect-error: invalid localization
				expect(() => getBuilder().setNameLocalization('en-U', 'foobar')).toThrowError();
				// @ts-expect-error: invalid localization
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
