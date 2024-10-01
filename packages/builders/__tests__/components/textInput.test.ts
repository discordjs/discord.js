import { ComponentType, TextInputStyle, type APITextInputComponent } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { TextInputBuilder } from '../../src/components/textInput/TextInput.js';

const superLongStr = 'a'.repeat(5_000);

const textInputComponent = () => new TextInputBuilder();

describe('Text Input Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid fields THEN builder does not throw', () => {
			expect(() => {
				textInputComponent().setCustomId('foobar').setLabel('test').setStyle(TextInputStyle.Paragraph).toJSON();
			}).not.toThrowError();

			expect(() => {
				textInputComponent()
					.setCustomId('foobar')
					.setLabel('test')
					.setMaxLength(100)
					.setMinLength(1)
					.setPlaceholder('bar')
					.setRequired(true)
					.setStyle(TextInputStyle.Paragraph)
					.toJSON();
			}).not.toThrowError();

			expect(() => {
				textInputComponent().setCustomId('Custom').setLabel('Guess').setStyle(TextInputStyle.Short).toJSON();
			}).not.toThrowError();
		});
	});

	test('GIVEN invalid fields THEN builder throws', () => {
		expect(() => textInputComponent().toJSON()).toThrowError();
		expect(() => {
			textInputComponent()
				.setCustomId('test')
				.setMaxLength(100)
				.setPlaceholder('hello')
				.setStyle(TextInputStyle.Paragraph)
				.toJSON();
		}).toThrowError();
	});

	test('GIVEN valid input THEN valid JSON outputs are given', () => {
		const textInputData: APITextInputComponent = {
			type: ComponentType.TextInput,
			label: 'label',
			custom_id: 'custom id',
			placeholder: 'placeholder',
			max_length: 100,
			min_length: 10,
			value: 'value',
			required: false,
			style: TextInputStyle.Paragraph,
		};

		expect(new TextInputBuilder(textInputData).toJSON()).toEqual(textInputData);
		expect(
			textInputComponent()
				.setCustomId(textInputData.custom_id)
				.setLabel(textInputData.label)
				.setPlaceholder(textInputData.placeholder!)
				.setMaxLength(textInputData.max_length!)
				.setMinLength(textInputData.min_length!)
				.setValue(textInputData.value!)
				.setRequired(textInputData.required)
				.setStyle(textInputData.style)
				.toJSON(),
		).toEqual(textInputData);
	});
});
