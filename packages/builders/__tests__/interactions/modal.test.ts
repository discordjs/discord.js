import { ComponentType, TextInputStyle, type APIModalInteractionResponseCallbackData } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { ModalBuilder, TextInputBuilder, LabelBuilder } from '../../src/index.js';

const modal = () => new ModalBuilder();

const label = () =>
	new LabelBuilder()
		.setLabel('label')
		.setTextInputComponent(new TextInputBuilder().setCustomId('text').setStyle(TextInputStyle.Short));

describe('Modals', () => {
	test('GIVEN valid fields THEN builder does not throw', () => {
		expect(() =>
			modal().setTitle('test').setCustomId('foobar').setLabelComponents(label()).toJSON(),
		).not.toThrowError();
		expect(() =>
			modal().setTitle('test').setCustomId('foobar').setLabelComponents(label()).toJSON(),
		).not.toThrowError();
	});

	test('GIVEN invalid fields THEN builder does throw', () => {
		expect(() => modal().setTitle('test').setCustomId('foobar').toJSON()).toThrowError();
		// @ts-expect-error: CustomId is invalid
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
					type: ComponentType.Label,
					label: 'label',
					description: 'description',
					component: {
						type: ComponentType.TextInput,
						style: TextInputStyle.Paragraph,
						custom_id: 'custom id',
					},
				},
			],
		} satisfies APIModalInteractionResponseCallbackData;

		expect(new ModalBuilder(modalData).toJSON()).toEqual(modalData);

		expect(
			modal()
				.setTitle(modalData.title)
				.setCustomId('custom id')
				.setLabelComponents(
					new LabelBuilder()
						.setId(33)
						.setLabel('label')
						.setDescription('description')
						.setTextInputComponent(new TextInputBuilder().setCustomId('custom id').setStyle(TextInputStyle.Paragraph)),
				)
				.addLabelComponents(
					new LabelBuilder()
						.setLabel('label')
						.setDescription('description')
						.setTextInputComponent(new TextInputBuilder().setCustomId('custom id').setStyle(TextInputStyle.Paragraph)),
				)
				.toJSON(),
		).toEqual(modalData);
	});
});
