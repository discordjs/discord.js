import type { APITextInputComponent } from 'discord-api-types/v10';
import { ComponentType, TextInputStyle } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	labelValidator,
	maxLengthValidator,
	minLengthValidator,
	placeholderValidator,
	valueValidator,
	textInputStyleValidator,
} from '../../src/components/textInput/Assertions.js';
import { TextInputBuilder } from '../../src/components/textInput/TextInput.js';

const superLongStr = 'a'.repeat(5_000);

const textInputComponent = () => new TextInputBuilder();

describe('Text Input Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid label THEN validator does not throw', () => {
			expect(() => labelValidator.parse('foobar')).not.toThrowError();
		});

		test('GIVEN invalid label THEN validator does throw', () => {
			expect(() => labelValidator.parse(24)).toThrowError();
			expect(() => labelValidator.parse(undefined)).toThrowError();
		});

		test('GIVEN valid style THEN validator does not throw', () => {
			expect(() => textInputStyleValidator.parse(TextInputStyle.Paragraph)).not.toThrowError();
			expect(() => textInputStyleValidator.parse(TextInputStyle.Short)).not.toThrowError();
		});

		test('GIVEN invalid style THEN validator does throw', () => {
			expect(() => textInputStyleValidator.parse(24)).toThrowError();
		});

		test('GIVEN valid min length THEN validator does not throw', () => {
			expect(() => minLengthValidator.parse(10)).not.toThrowError();
		});

		test('GIVEN invalid min length THEN validator does throw', () => {
			expect(() => minLengthValidator.parse(-1)).toThrowError();
		});

		test('GIVEN valid max length THEN validator does not throw', () => {
			expect(() => maxLengthValidator.parse(10)).not.toThrowError();
		});

		test('GIVEN invalid min length THEN validator does throw 2', () => {
			expect(() => maxLengthValidator.parse(4_001)).toThrowError();
		});

		test('GIVEN valid value THEN validator does not throw', () => {
			expect(() => valueValidator.parse('foobar')).not.toThrowError();
		});

		test('GIVEN invalid value THEN validator does throw', () => {
			expect(() => valueValidator.parse(superLongStr)).toThrowError();
		});

		test('GIVEN valid placeholder THEN validator does not throw', () => {
			expect(() => placeholderValidator.parse('foobar')).not.toThrowError();
		});

		test('GIVEN invalid value THEN validator does throw 2', () => {
			expect(() => placeholderValidator.parse(superLongStr)).toThrowError();
		});

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
				// Issue #8107
				// @ts-expect-error: shapeshift maps the enum key to the value when parsing
				textInputComponent().setCustomId('Custom').setLabel('Guess').setStyle('Short').toJSON();
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
