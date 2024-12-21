import {
	ApplicationCommandOptionType,
	ChannelType,
	type APIApplicationCommandAttachmentOption,
	type APIApplicationCommandBooleanOption,
	type APIApplicationCommandChannelOption,
	type APIApplicationCommandIntegerOption,
	type APIApplicationCommandMentionableOption,
	type APIApplicationCommandNumberOption,
	type APIApplicationCommandRoleOption,
	type APIApplicationCommandStringOption,
	type APIApplicationCommandUserOption,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	ChatInputCommandAttachmentOption,
	ChatInputCommandBooleanOption,
	ChatInputCommandChannelOption,
	ChatInputCommandIntegerOption,
	ChatInputCommandMentionableOption,
	ChatInputCommandNumberOption,
	ChatInputCommandRoleOption,
	ChatInputCommandStringOption,
	ChatInputCommandUserOption,
} from '../../../src/index.js';

const getBooleanOption = () =>
	new ChatInputCommandBooleanOption().setName('owo').setDescription('Testing 123').setRequired(true);

const getChannelOption = () =>
	new ChatInputCommandChannelOption()
		.setName('owo')
		.setDescription('Testing 123')
		.setRequired(true)
		.addChannelTypes(ChannelType.GuildText);

const getStringOption = () =>
	new ChatInputCommandStringOption().setName('owo').setDescription('Testing 123').setRequired(true);

const getIntegerOption = () =>
	new ChatInputCommandIntegerOption()
		.setName('owo')
		.setDescription('Testing 123')
		.setRequired(true)
		.setMinValue(-1)
		.setMaxValue(10);

const getNumberOption = () =>
	new ChatInputCommandNumberOption()
		.setName('owo')
		.setDescription('Testing 123')
		.setRequired(true)
		.setMinValue(-1.23)
		.setMaxValue(10);

const getUserOption = () =>
	new ChatInputCommandUserOption().setName('owo').setDescription('Testing 123').setRequired(true);

const getRoleOption = () =>
	new ChatInputCommandRoleOption().setName('owo').setDescription('Testing 123').setRequired(true);

const getMentionableOption = () =>
	new ChatInputCommandMentionableOption().setName('owo').setDescription('Testing 123').setRequired(true);

const getAttachmentOption = () =>
	new ChatInputCommandAttachmentOption().setName('attachment').setDescription('attachment').setRequired(true);

describe('Application Command toJSON() results', () => {
	test('GIVEN a boolean option THEN calling toJSON should return a valid JSON', () => {
		expect(getBooleanOption().toJSON()).toEqual<APIApplicationCommandBooleanOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.Boolean,
			required: true,
		});
	});

	test('GIVEN a channel option THEN calling toJSON should return a valid JSON', () => {
		expect(getChannelOption().toJSON()).toEqual<APIApplicationCommandChannelOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.Channel,
			required: true,
			channel_types: [ChannelType.GuildText],
		});
	});

	test('GIVEN a integer option THEN calling toJSON should return a valid JSON', () => {
		expect(getIntegerOption().toJSON()).toEqual<APIApplicationCommandIntegerOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.Integer,
			required: true,
			max_value: 10,
			min_value: -1,
		});

		expect(getIntegerOption().setAutocomplete(true).setChoices().toJSON()).toEqual<APIApplicationCommandIntegerOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.Integer,
			required: true,
			max_value: 10,
			min_value: -1,
			autocomplete: true,
			choices: [],
		});

		expect(
			getIntegerOption().addChoices({ name: 'uwu', value: 1 }).toJSON(),
		).toEqual<APIApplicationCommandIntegerOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.Integer,
			required: true,
			max_value: 10,
			min_value: -1,
			choices: [{ name: 'uwu', value: 1 }],
		});
	});

	test('GIVEN a mentionable option THEN calling toJSON should return a valid JSON', () => {
		expect(getMentionableOption().toJSON()).toEqual<APIApplicationCommandMentionableOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.Mentionable,
			required: true,
		});
	});

	test('GIVEN a number option THEN calling toJSON should return a valid JSON', () => {
		expect(getNumberOption().toJSON()).toEqual<APIApplicationCommandNumberOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.Number,
			required: true,
			max_value: 10,
			min_value: -1.23,
		});

		expect(getNumberOption().setAutocomplete(true).setChoices().toJSON()).toEqual<APIApplicationCommandNumberOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.Number,
			required: true,
			max_value: 10,
			min_value: -1.23,
			autocomplete: true,
			// TODO
			choices: [],
		});

		expect(getNumberOption().addChoices({ name: 'uwu', value: 1 }).toJSON()).toEqual<APIApplicationCommandNumberOption>(
			{
				name: 'owo',
				description: 'Testing 123',
				type: ApplicationCommandOptionType.Number,
				required: true,
				max_value: 10,
				min_value: -1.23,
				choices: [{ name: 'uwu', value: 1 }],
			},
		);
	});

	test('GIVEN a role option THEN calling toJSON should return a valid JSON', () => {
		expect(getRoleOption().toJSON()).toEqual<APIApplicationCommandRoleOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.Role,
			required: true,
		});
	});

	test('GIVEN a string option THEN calling toJSON should return a valid JSON', () => {
		expect(getStringOption().setMinLength(1).setMaxLength(10).toJSON()).toEqual<APIApplicationCommandStringOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.String,
			required: true,
			max_length: 10,
			min_length: 1,
		});

		expect(getStringOption().setAutocomplete(true).setChoices().toJSON()).toEqual<APIApplicationCommandStringOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
			// TODO
			choices: [],
		});

		expect(
			getStringOption().addChoices({ name: 'uwu', value: '1' }).toJSON(),
		).toEqual<APIApplicationCommandStringOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [{ name: 'uwu', value: '1' }],
		});
	});

	test('GIVEN a user option THEN calling toJSON should return a valid JSON', () => {
		expect(getUserOption().toJSON()).toEqual<APIApplicationCommandUserOption>({
			name: 'owo',
			description: 'Testing 123',
			type: ApplicationCommandOptionType.User,
			required: true,
		});
	});

	test('GIVEN an attachment option THEN calling toJSON should return a valid JSON', () => {
		expect(getAttachmentOption().toJSON()).toEqual<APIApplicationCommandAttachmentOption>({
			name: 'attachment',
			description: 'attachment',
			type: ApplicationCommandOptionType.Attachment,
			required: true,
		});
	});
});
