import { ComponentType, TextInputStyle, type APIModalInteractionResponseCallbackData } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '../../src/index.js';

const modal = () => new ModalBuilder();
const textInput = () =>
	new ActionRowBuilder().addTextInputComponent(
		new TextInputBuilder().setCustomId('text').setLabel(':3').setStyle(TextInputStyle.Short),
	);

describe('Modals', () => {
	test('GIVEN valid fields THEN builder does not throw', () => {
		expect(() => modal().setTitle('test').setCustomId('foobar').setActionRows(textInput()).toJSON()).not.toThrowError();
		expect(() => modal().setTitle('test').setCustomId('foobar').addActionRows(textInput()).toJSON()).not.toThrowError();
	});

	test('GIVEN invalid fields THEN builder does throw', () => {
		expect(() => modal().setTitle('test').setCustomId('foobar').toJSON()).toThrowError();
		// @ts-expect-error: CustomId is invalid
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
				.setActionRows(
					new ActionRowBuilder().addTextInputComponent(
						new TextInputBuilder().setCustomId('custom id').setLabel('label').setStyle(TextInputStyle.Paragraph),
					),
				)
				.addActionRows([
					new ActionRowBuilder().addTextInputComponent(
						new TextInputBuilder().setCustomId('custom id').setLabel('label').setStyle(TextInputStyle.Paragraph),
					),
				])
				.toJSON(),
		).toEqual(modalData);
	});
});
