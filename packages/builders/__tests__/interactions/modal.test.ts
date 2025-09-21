import { ComponentType, TextInputStyle, type APIModalInteractionResponseCallbackData } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { ModalBuilder, TextInputBuilder, LabelBuilder, TextDisplayBuilder } from '../../src/index.js';

const modal = () => new ModalBuilder();

const label = () =>
	new LabelBuilder()
		.setLabel('label')
		.setTextInputComponent(new TextInputBuilder().setCustomId('text').setStyle(TextInputStyle.Short));

const textDisplay = () => new TextDisplayBuilder().setContent('text');

describe('Modals', () => {
	test('GIVEN valid fields THEN builder does not throw', () => {
		expect(() =>
			modal().setTitle('test').setCustomId('foobar').addLabelComponents(label()).toJSON(),
		).not.toThrowError();

		expect(() =>
			modal().setTitle('test').setCustomId('foobar').addLabelComponents(label()).toJSON(),
		).not.toThrowError();

		expect(() =>
			modal().setTitle('test').setCustomId('foobar').addTextDisplayComponents(textDisplay()).toJSON(),
		).not.toThrowError();
	});

	test('GIVEN invalid fields THEN builder does throw', () => {
		expect(() => modal().setTitle('test').setCustomId('foobar').toJSON()).toThrowError();

		// @ts-expect-error: Custom id is invalid
		expect(() => modal().setTitle('test').setCustomId(42).toJSON()).toThrowError();
	});

	test('GIVEN valid input THEN valid JSON outputs are given', () => {
		const modalData = {
			title: 'title',
			custom_id: 'custom id',
			components: [
				{
					type: ComponentType.Label,
					id: 33,
					label: 'label',
					description: 'description',
					component: {
						type: ComponentType.TextInput,
						style: TextInputStyle.Paragraph,
						custom_id: 'custom id',
					},
				},
				{
					type: ComponentType.TextDisplay,
					content: 'yooooooooo',
				},
			],
		} satisfies APIModalInteractionResponseCallbackData;

		expect(new ModalBuilder(modalData).toJSON()).toEqual(modalData);

		expect(
			modal()
				.setTitle(modalData.title)
				.setCustomId('custom id')
				.addLabelComponents(
					new LabelBuilder()
						.setId(33)
						.setLabel('label')
						.setDescription('description')
						.setTextInputComponent(new TextInputBuilder().setCustomId('custom id').setStyle(TextInputStyle.Paragraph)),
				)
				.addTextDisplayComponents((textDisplay) => textDisplay.setContent('yooooooooo'))
				.toJSON(),
		).toEqual(modalData);
	});
});
