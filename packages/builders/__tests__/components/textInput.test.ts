import { ComponentType, TextInputStyle, type APITextInputComponent } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { TextInputBuilder } from '../../src/components/textInput/TextInput.js';

const textInputComponent = () => new TextInputBuilder();

describe('Text Input Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid fields THEN builder does not throw', () => {
			expect(() => {
				textInputComponent().setCustomId('foobar').setStyle(TextInputStyle.Paragraph).toJSON();
			}).not.toThrowError();

			expect(() => {
				textInputComponent()
					.setCustomId('foobar')
					.setMaxLength(100)
					.setMinLength(1)
					.setPlaceholder('bar')
					.setRequired(true)
					.setStyle(TextInputStyle.Paragraph)
					.toJSON();
			}).not.toThrowError();

			expect(() => {
				textInputComponent().setCustomId('Custom').setStyle(TextInputStyle.Short).toJSON();
			}).not.toThrowError();
		});
	});

	test('GIVEN invalid fields THEN builder throws', () => {
		expect(() => textInputComponent().toJSON()).toThrowError();
		expect(() => {
			textInputComponent()
				.setCustomId('a'.repeat(500))
				.setMaxLength(100)
				.setPlaceholder('a'.repeat(500))
				.setStyle(3 as TextInputStyle)
				.toJSON();
		}).toThrowError();
	});

	test('GIVEN valid input THEN valid JSON outputs are given', () => {
		const textInputData = {
			type: ComponentType.TextInput,
			custom_id: 'custom id',
			placeholder: 'placeholder',
			max_length: 100,
			min_length: 10,
			value: 'value',
			required: false,
			style: TextInputStyle.Paragraph,
		} satisfies APITextInputComponent;

		expect(new TextInputBuilder(textInputData).toJSON()).toEqual(textInputData);
		expect(
			textInputComponent()
				.setCustomId(textInputData.custom_id)
				.setPlaceholder(textInputData.placeholder)
				.setMaxLength(textInputData.max_length)
				.setMinLength(textInputData.min_length)
				.setValue(textInputData.value)
				.setRequired(textInputData.required)
				.setStyle(textInputData.style)
				.toJSON(),
		).toEqual(textInputData);
	});
});
