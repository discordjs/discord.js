import type {
	APICheckboxComponent,
	APICheckboxGroupComponent,
	APILabelComponent,
	APIRadioGroupComponent,
} from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	CheckboxBuilder,
	CheckboxGroupBuilder,
	CheckboxGroupOptionBuilder,
	createComponentBuilder,
	LabelBuilder,
	RadioGroupBuilder,
	RadioGroupOptionBuilder,
} from '../../src/index.js';

const checkboxData = {
	type: ComponentType.Checkbox,
	custom_id: 'checkbox',
	default: true,
	id: 3,
} satisfies APICheckboxComponent;

const checkboxGroupData = {
	type: ComponentType.CheckboxGroup,
	custom_id: 'checkbox_group',
	options: [
		{ label: 'first', value: '1', description: 'the first', default: true },
		{ label: 'second', value: '2' },
		{ label: 'third', value: '3' },
	],
	min_values: 1,
	max_values: 2,
	required: true,
} satisfies APICheckboxGroupComponent;

const radioGroupData = {
	type: ComponentType.RadioGroup,
	custom_id: 'radio_group',
	options: [
		{ label: 'first', value: '1', description: 'the first', default: true },
		{ label: 'second', value: '2' },
	],
	required: false,
} satisfies APIRadioGroupComponent;

const options = (length: number) => Array.from({ length }, (_, index) => ({ label: `${index}`, value: `${index}` }));

const checkboxGroup = (optionCount = 0) =>
	new CheckboxGroupBuilder().setCustomId('group').setOptions(options(optionCount));

const radioGroup = () => new RadioGroupBuilder().setCustomId('group');

const label = (component: APILabelComponent['component']) =>
	({ type: ComponentType.Label, label: 'label', component }) satisfies APILabelComponent;

describe('Checkbox components', () => {
	describe('CheckboxBuilder', () => {
		test('GIVEN valid fields THEN valid JSON outputs are given', () => {
			expect(new CheckboxBuilder(checkboxData).toJSON()).toEqual(checkboxData);
			expect(new CheckboxBuilder().setCustomId('checkbox').setDefault().setId(3).toJSON()).toEqual(checkboxData);
			expect(new CheckboxBuilder(checkboxData).setDefault(false).toJSON().default).toBe(false);
		});

		test('GIVEN invalid fields THEN builder throws', () => {
			expect(() => new CheckboxBuilder().toJSON()).toThrow();
			expect(() => new CheckboxBuilder().setCustomId('a'.repeat(101)).toJSON()).toThrow();
			// @ts-expect-error Invalid default
			expect(() => new CheckboxBuilder().setCustomId('checkbox').setDefault('yes').toJSON()).toThrow();
		});

		test('GIVEN invalid fields and validation disabled THEN builder does not throw', () => {
			expect(new CheckboxBuilder().toJSON(false)).toEqual({ type: ComponentType.Checkbox });
		});
	});

	describe('CheckboxGroupOptionBuilder', () => {
		test('GIVEN valid fields THEN valid JSON outputs are given', () => {
			const [option] = checkboxGroupData.options;

			expect(new CheckboxGroupOptionBuilder(option).toJSON()).toEqual(option);
			expect(
				new CheckboxGroupOptionBuilder()
					.setLabel('first')
					.setValue('1')
					.setDescription('the first')
					.setDefault()
					.toJSON(),
			).toEqual(option);
			expect(new CheckboxGroupOptionBuilder(option).clearDescription().toJSON().description).toBeUndefined();
		});

		test('GIVEN invalid fields THEN builder throws', () => {
			expect(() => new CheckboxGroupOptionBuilder().toJSON()).toThrow();
			expect(() => new CheckboxGroupOptionBuilder().setLabel('label').toJSON()).toThrow();
			expect(() => new CheckboxGroupOptionBuilder().setLabel('').setValue('value').toJSON()).toThrow();
			expect(() => new CheckboxGroupOptionBuilder().setLabel('label').setValue('a'.repeat(101)).toJSON()).toThrow();
			expect(() =>
				new CheckboxGroupOptionBuilder().setLabel('label').setValue('value').setDescription('a'.repeat(101)).toJSON(),
			).toThrow();
		});
	});

	describe('CheckboxGroupBuilder', () => {
		test('GIVEN valid fields THEN valid JSON outputs are given', () => {
			expect(new CheckboxGroupBuilder(checkboxGroupData).toJSON()).toEqual(checkboxGroupData);

			expect(
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.addOptions(
						(option) => option.setLabel('first').setValue('1').setDescription('the first').setDefault(),
						new CheckboxGroupOptionBuilder().setLabel('second').setValue('2'),
					)
					.addOptions([{ label: 'third', value: '3' }])
					.setMinValues(1)
					.setMaxValues(2)
					.setRequired()
					.toJSON(),
			).toEqual(checkboxGroupData);

			expect(() => new CheckboxGroupBuilder().setCustomId('group').setOptions(options(10)).toJSON()).not.toThrow();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('group')
					.setOptions(options(2))
					.setMinValues(0)
					.setRequired(false)
					.toJSON(),
			).not.toThrow();
		});

		test('GIVEN options THEN they can be set, spliced and read', () => {
			const builder = new CheckboxGroupBuilder(checkboxGroupData);

			builder.setOptions({ label: 'a', value: 'a' }, { label: 'b', value: 'b' });
			expect(builder.options.map((option) => option.toJSON().value)).toEqual(['a', 'b']);

			builder.setOptions([{ label: 'c', value: 'c' }]);
			expect(builder.toJSON(false).options).toEqual([{ label: 'c', value: 'c' }]);

			builder.spliceOptions(0, 0, { label: 'd', value: 'd' }, (option) => option.setLabel('e').setValue('e'));
			expect(builder.toJSON(false).options.map((option) => option.value)).toEqual(['d', 'e', 'c']);

			builder.spliceOptions(-1, 1);
			expect(builder.toJSON(false).options.map((option) => option.value)).toEqual(['d', 'e']);
		});

		test('GIVEN min and max values THEN they can be cleared', () => {
			const data = new CheckboxGroupBuilder(checkboxGroupData).clearMinValues().clearMaxValues().toJSON();

			expect(data.min_values).toBeUndefined();
			expect(data.max_values).toBeUndefined();
		});

		test('GIVEN invalid fields THEN builder throws', () => {
			expect(() => new CheckboxGroupBuilder().setOptions(options(2)).toJSON()).toThrow();
			expect(() => checkboxGroup().toJSON()).toThrow();
			expect(() => checkboxGroup(11).toJSON()).toThrow();
			expect(() => checkboxGroup().setOptions({ label: 'label', value: '' }).toJSON()).toThrow();
			expect(() => checkboxGroup(3).setMinValues(-1).toJSON()).toThrow();
			expect(() => checkboxGroup(3).setMinValues(1.5).toJSON()).toThrow();
			expect(() => checkboxGroup(3).setMaxValues(0).toJSON()).toThrow();
			expect(() => checkboxGroup(10).setMaxValues(11).toJSON()).toThrow();
		});

		test('GIVEN inconsistent fields THEN builder throws', () => {
			expect(() => checkboxGroup(3).setMinValues(3).setMaxValues(2).toJSON()).toThrow();
			expect(() => checkboxGroup(3).setMaxValues(4).toJSON()).toThrow();
			expect(() => checkboxGroup(3).setMinValues(4).toJSON()).toThrow();
			expect(() => checkboxGroup(3).setMinValues(0).setRequired().toJSON()).toThrow();
			expect(() => checkboxGroup(3).setMinValues(0).toJSON()).toThrow();
			expect(() =>
				checkboxGroup()
					.setOptions(
						{ label: 'a', value: 'a', default: true },
						{ label: 'b', value: 'b', default: true },
						{ label: 'c', value: 'c' },
					)
					.setMaxValues(1)
					.toJSON(),
			).toThrow();
			expect(() => checkboxGroup(3).addOptions({ label: 'duplicate', value: '0' }).toJSON()).toThrow();
		});
	});

	describe('RadioGroupOptionBuilder', () => {
		test('GIVEN valid fields THEN valid JSON outputs are given', () => {
			const [option] = radioGroupData.options;

			expect(new RadioGroupOptionBuilder(option).toJSON()).toEqual(option);
			expect(
				new RadioGroupOptionBuilder().setLabel('first').setValue('1').setDescription('the first').setDefault().toJSON(),
			).toEqual(option);
			expect(new RadioGroupOptionBuilder(option).clearDescription().toJSON().description).toBeUndefined();
		});

		test('GIVEN invalid fields THEN builder throws', () => {
			expect(() => new RadioGroupOptionBuilder().toJSON()).toThrow();
			expect(() => new RadioGroupOptionBuilder().setValue('value').toJSON()).toThrow();
			expect(() => new RadioGroupOptionBuilder().setLabel('a'.repeat(101)).setValue('value').toJSON()).toThrow();
		});
	});

	describe('RadioGroupBuilder', () => {
		test('GIVEN valid fields THEN valid JSON outputs are given', () => {
			expect(new RadioGroupBuilder(radioGroupData).toJSON()).toEqual(radioGroupData);

			expect(
				new RadioGroupBuilder()
					.setCustomId('radio_group')
					.addOptions((option) => option.setLabel('first').setValue('1').setDescription('the first').setDefault())
					.addOptions([new RadioGroupOptionBuilder().setLabel('second').setValue('2')])
					.setRequired(false)
					.toJSON(),
			).toEqual(radioGroupData);

			expect(() => new RadioGroupBuilder().setCustomId('group').setOptions(options(10)).toJSON()).not.toThrow();
		});

		test('GIVEN options THEN they can be set, spliced and read', () => {
			const builder = new RadioGroupBuilder(radioGroupData);

			builder.setOptions({ label: 'a', value: 'a' }, { label: 'b', value: 'b' });
			expect(builder.options.map((option) => option.toJSON().value)).toEqual(['a', 'b']);

			builder.spliceOptions(1, 1, { label: 'c', value: 'c' }, (option) => option.setLabel('d').setValue('d'));
			expect(builder.toJSON().options.map((option) => option.value)).toEqual(['a', 'c', 'd']);
		});

		test('GIVEN invalid fields THEN builder throws', () => {
			expect(() => new RadioGroupBuilder().setOptions(options(2)).toJSON()).toThrow();
			expect(() => radioGroup().toJSON()).toThrow();
			expect(() => radioGroup().setOptions(options(1)).toJSON()).toThrow();
			expect(() => radioGroup().setOptions(options(11)).toJSON()).toThrow();
			expect(() =>
				radioGroup()
					.setOptions({ label: 'a', value: 'a', default: true }, { label: 'b', value: 'b', default: true })
					.toJSON(),
			).toThrow();
			expect(() =>
				radioGroup().setOptions({ label: 'a', value: 'same' }, { label: 'b', value: 'same' }).toJSON(),
			).toThrow();
		});
	});

	describe('createComponentBuilder', () => {
		test('GIVEN API data THEN the matching builder is returned', () => {
			expect(createComponentBuilder(checkboxData)).toBeInstanceOf(CheckboxBuilder);
			expect(createComponentBuilder(checkboxGroupData)).toBeInstanceOf(CheckboxGroupBuilder);
			expect(createComponentBuilder(radioGroupData)).toBeInstanceOf(RadioGroupBuilder);
			expect(createComponentBuilder(checkboxGroupData).toJSON()).toEqual(checkboxGroupData);
		});
	});

	describe('LabelBuilder', () => {
		test('GIVEN API data THEN valid JSON outputs are given', () => {
			for (const component of [checkboxData, checkboxGroupData, radioGroupData]) {
				expect(new LabelBuilder(label(component)).toJSON()).toEqual(label(component));
			}
		});

		test('GIVEN setters THEN valid JSON outputs are given', () => {
			expect(
				new LabelBuilder()
					.setLabel('label')
					.setCheckboxComponent((checkbox) => checkbox.setCustomId('checkbox').setDefault().setId(3))
					.toJSON(),
			).toEqual(label(checkboxData));

			expect(new LabelBuilder().setLabel('label').setCheckboxGroupComponent(checkboxGroupData).toJSON()).toEqual(
				label(checkboxGroupData),
			);

			expect(
				new LabelBuilder().setLabel('label').setRadioGroupComponent(new RadioGroupBuilder(radioGroupData)).toJSON(),
			).toEqual(label(radioGroupData));
		});

		test('GIVEN an invalid child component THEN builder throws', () => {
			expect(() =>
				new LabelBuilder()
					.setLabel('label')
					.setCheckboxComponent((checkbox) => checkbox)
					.toJSON(),
			).toThrow();

			expect(() =>
				new LabelBuilder()
					.setLabel('label')
					.setCheckboxGroupComponent((group) => group.setCustomId('group').setOptions(options(2)).setMaxValues(3))
					.toJSON(),
			).toThrow();

			expect(() =>
				new LabelBuilder()
					.setLabel('label')
					.setRadioGroupComponent((group) => group.setCustomId('group').setOptions(options(1)))
					.toJSON(),
			).toThrow();
		});
	});
});
