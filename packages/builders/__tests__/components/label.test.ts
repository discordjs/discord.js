import type { APILabelComponent, APIStringSelectComponent, APITextInputComponent } from 'discord-api-types/v10';
import { ComponentType, TextInputStyle } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { LabelBuilder } from '../../src/index.js';

describe('Label components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid fields THEN builder does not throw', () => {
			expect(() =>
				new LabelBuilder()
					.setLabel('label')
					.setStringSelectMenuComponent((stringSelectMenu) =>
						stringSelectMenu
							.setCustomId('test')
							.setOptions((stringSelectMenuOption) => stringSelectMenuOption.setLabel('label').setValue('value'))
							.setRequired(),
					)
					.toJSON(),
			).not.toThrow();

			expect(() =>
				new LabelBuilder()
					.setLabel('label')
					.setId(5)
					.setTextInputComponent((textInput) =>
						textInput.setCustomId('test').setStyle(TextInputStyle.Paragraph).setRequired(),
					)
					.toJSON(),
			).not.toThrow();
		});

		test('GIVEN invalid fields THEN build does throw', () => {
			expect(() => new LabelBuilder().toJSON()).toThrow();
			expect(() => new LabelBuilder().setId(5).toJSON()).toThrow();
			expect(() => new LabelBuilder().setLabel('label').toJSON()).toThrow();

			expect(() =>
				new LabelBuilder()
					.setLabel('l'.repeat(1_000))
					.setStringSelectMenuComponent((stringSelectMenu) => stringSelectMenu)
					.toJSON(),
			).toThrow();
		});

		test('GIVEN valid input THEN valid JSON outputs are given', () => {
			const labelWithTextInputData = {
				type: ComponentType.Label,
				component: {
					type: ComponentType.TextInput,
					custom_id: 'custom_id',
					placeholder: 'placeholder',
					style: TextInputStyle.Paragraph,
				} satisfies APITextInputComponent,
				label: 'label',
				description: 'description',
				id: 5,
			} satisfies APILabelComponent;

			const labelWithStringSelectData = {
				type: ComponentType.Label,
				component: {
					type: ComponentType.StringSelect,
					custom_id: 'custom_id',
					placeholder: 'placeholder',
					options: [
						{ label: 'first', value: 'first' },
						{ label: 'second', value: 'second' },
					],
					required: true,
				} satisfies APIStringSelectComponent,
				label: 'label',
				description: 'description',
				id: 5,
			} satisfies APILabelComponent;

			expect(new LabelBuilder(labelWithTextInputData).toJSON()).toEqual(labelWithTextInputData);
			expect(new LabelBuilder(labelWithStringSelectData).toJSON()).toEqual(labelWithStringSelectData);

			expect(
				new LabelBuilder()
					.setTextInputComponent((textInput) =>
						textInput.setCustomId('custom_id').setPlaceholder('placeholder').setStyle(TextInputStyle.Paragraph),
					)
					.setLabel('label')
					.setDescription('description')
					.setId(5)
					.toJSON(),
			).toEqual(labelWithTextInputData);

			expect(
				new LabelBuilder()
					.setStringSelectMenuComponent((stringSelectMenu) =>
						stringSelectMenu
							.setCustomId('custom_id')
							.setPlaceholder('placeholder')
							.setOptions(
								(stringSelectMenuOption) => stringSelectMenuOption.setLabel('first').setValue('first'),
								(stringSelectMenuOption) => stringSelectMenuOption.setLabel('second').setValue('second'),
							)
							.setRequired(),
					)
					.setLabel('label')
					.setDescription('description')
					.setId(5)
					.toJSON(),
			).toEqual(labelWithStringSelectData);
		});
	});
});
