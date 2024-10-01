import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	PermissionFlagsBits,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { MessageContextCommandBuilder } from '../../src/index.js';

const getBuilder = () => new MessageContextCommandBuilder();

describe('Context Menu Commands', () => {
	describe('ContextMenuCommandBuilder', () => {
		describe('Builder tests', () => {
			test('GIVEN empty builder THEN throw error when calling toJSON', () => {
				expect(() => getBuilder().toJSON()).toThrowError();
			});

			test('GIVEN invalid name THEN throw error', () => {
				expect(() => getBuilder().setName('$$$').toJSON()).toThrowError();

				expect(() => getBuilder().setName(' ').toJSON()).toThrowError();
			});

			test('GIVEN valid names THEN does not throw error', () => {
				expect(() => getBuilder().setName('hi_there').toJSON()).not.toThrowError();

				expect(() => getBuilder().setName('A COMMAND').toJSON()).not.toThrowError();

				// Translation: a_command
				expect(() => getBuilder().setName('o_comandă')).not.toThrowError();

				// Translation: thx (according to GTranslate)
				expect(() => getBuilder().setName('どうも')).not.toThrowError();
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
				// @ts-expect-error: Invalid localization
				expect(() => getBuilder().setNameLocalization('en-U', 'foobar').toJSON()).toThrowError();
				// @ts-expect-error: Invalid localization
				expect(() => getBuilder().setNameLocalizations({ 'en-U': 'foobar' }).toJSON()).toThrowError();
			});

			test('GIVEN valid name localizations THEN valid data is stored', () => {
				expect(getBuilder().setName('hi').setNameLocalization('en-US', 'foobar').toJSON().name_localizations).toEqual(
					expectedSingleLocale,
				);
				expect(
					getBuilder().setName('hi').setNameLocalizations({ 'en-US': 'foobar', bg: 'test' }).toJSON()
						.name_localizations,
				).toEqual(expectedMultipleLocales);
				expect(getBuilder().setName('hi').clearNameLocalizations().toJSON().name_localizations).toBeUndefined();
				expect(getBuilder().setName('hi').clearNameLocalization('en-US').toJSON().name_localizations).toEqual({
					'en-US': undefined,
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

			test('GIVEN invalid inputs THEN does throw error', () => {
				expect(() => getBuilder().setName('hi').setDefaultMemberPermissions('1.1').toJSON()).toThrowError();

				expect(() => getBuilder().setName('hi').setDefaultMemberPermissions(1.1).toJSON()).toThrowError();
			});
		});

		describe('contexts', () => {
			test('GIVEN a builder with valid contexts THEN does not throw an error', () => {
				expect(() =>
					getBuilder().setContexts([InteractionContextType.Guild, InteractionContextType.BotDM]),
				).not.toThrowError();

				expect(() =>
					getBuilder().setContexts(InteractionContextType.Guild, InteractionContextType.BotDM),
				).not.toThrowError();
			});

			test('GIVEN a builder with invalid contexts THEN does throw an error', () => {
				// @ts-expect-error: Invalid contexts
				expect(() => getBuilder().setName('hi').setContexts(999).toJSON()).toThrowError();

				// @ts-expect-error: Invalid contexts
				expect(() => getBuilder().setName('hi').setContexts([999, 998]).toJSON()).toThrowError();
			});
		});

		describe('integration types', () => {
			test('GIVEN a builder with valid integraton types THEN does not throw an error', () => {
				expect(() =>
					getBuilder().setIntegrationTypes([
						ApplicationIntegrationType.GuildInstall,
						ApplicationIntegrationType.UserInstall,
					]),
				).not.toThrowError();

				expect(() =>
					getBuilder().setIntegrationTypes(
						ApplicationIntegrationType.GuildInstall,
						ApplicationIntegrationType.UserInstall,
					),
				).not.toThrowError();
			});

			test('GIVEN a builder with invalid integration types THEN does throw an error', () => {
				// @ts-expect-error: Invalid integration types
				expect(() => getBuilder().setName('hi').setIntegrationTypes(999).toJSON()).toThrowError();

				// @ts-expect-error: Invalid integration types
				expect(() => getBuilder().setName('hi').setIntegrationTypes([999, 998]).toJSON()).toThrowError();
			});
		});
	});
});
