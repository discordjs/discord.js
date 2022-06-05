import { APIModalInteractionResponseCallbackData, ComponentType, TextInputStyle } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ModalBuilder,
	ModalActionRowComponentBuilder,
	TextInputBuilder,
} from '../../src';
import {
	componentsValidator,
	titleValidator,
	validateRequiredParameters,
} from '../../src/interactions/modals/Assertions';

const modal = () => new ModalBuilder();

describe('Modals', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid title THEN validator does not throw', () => {
			expect(() => titleValidator.parse('foobar')).not.toThrowError();
		});

		test('GIVEN invalid title THEN validator does throw', () => {
			expect(() => titleValidator.parse(42)).toThrowError();
		});

		test('GIVEN valid components THEN validator does not throw', () => {
			expect(() => componentsValidator.parse([new ActionRowBuilder(), new ActionRowBuilder()])).not.toThrowError();
		});

		test('GIVEN invalid components THEN validator does throw', () => {
			expect(() => componentsValidator.parse([new ButtonBuilder(), new TextInputBuilder()])).toThrowError();
		});

		test('GIVEN valid required parameters THEN validator does not throw', () => {
			expect(() =>
				validateRequiredParameters('123', 'title', [new ActionRowBuilder(), new ActionRowBuilder()]),
			).not.toThrowError();
		});

		test('GIVEN invalid required parameters THEN validator does throw', () => {
			expect(() =>
				// @ts-expect-error
				validateRequiredParameters('123', undefined, [new ActionRowBuilder(), new ButtonBuilder()]),
			).toThrowError();
		});
	});

	test('GIVEN valid fields THEN builder does not throw', () => {
		expect(() =>
			modal()
				.setTitle('test')
				.setCustomId('foobar')
				.setComponents(new ActionRowBuilder())
				.addComponents([new ActionRowBuilder()]),
		).not.toThrowError();
	});

	test('GIVEN invalid fields THEN builder does throw', () => {
		expect(() => modal().setTitle('test').setCustomId('foobar').toJSON()).toThrowError();
		// @ts-expect-error
		expect(() => modal().setTitle('test').setCustomId(42).toJSON()).toThrowError();
	});

	test('GIVEN valid input THEN valid JSON outputs are given', () => {
		const modalData: APIModalInteractionResponseCallbackData = {
			title: 'title',
			custom_id: 'custom id',
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.TextInput,
							label: 'label',
							style: TextInputStyle.Paragraph,
							custom_id: 'custom id',
						},
					],
				},
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.TextInput,
							label: 'label',
							style: TextInputStyle.Paragraph,
							custom_id: 'custom id',
						},
					],
				},
			],
		};

		expect(new ModalBuilder(modalData).toJSON()).toEqual(modalData);

		expect(
			modal()
				.setTitle(modalData.title)
				.setCustomId('custom id')
				.setComponents(
					new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
						new TextInputBuilder().setCustomId('custom id').setLabel('label').setStyle(TextInputStyle.Paragraph),
					),
				)
				.addComponents([
					new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
						new TextInputBuilder().setCustomId('custom id').setLabel('label').setStyle(TextInputStyle.Paragraph),
					),
				])
				.toJSON(),
		).toEqual(modalData);
	});
});
