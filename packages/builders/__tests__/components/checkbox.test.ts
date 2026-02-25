import { ComponentType, type APICheckboxComponent } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { LabelBuilder } from '../../src';
import { CheckboxBuilder } from '../../src/components/checkbox/Checkbox';
import { CheckboxGroupBuilder } from '../../src/components/checkbox/CheckboxGroup';
import { CheckboxGroupOptionBuilder } from '../../src/components/checkbox/CheckboxGroupOption';
import { RadioGroupBuilder } from '../../src/components/checkbox/RadioGroup';
import { RadioGroupOptionBuilder } from '../../src/components/checkbox/RadioGroupOption';

const longStr = ':3'.repeat(5_000);

const fiveCheckboxOptions = [
	new CheckboxGroupOptionBuilder().setLabel('Option 1').setValue('option_1'),
	new CheckboxGroupOptionBuilder().setLabel('Option 2').setValue('option_2'),
	new CheckboxGroupOptionBuilder().setLabel('Option 3').setValue('option_3'),
	new CheckboxGroupOptionBuilder().setLabel('Option 4').setValue('option_4'),
	new CheckboxGroupOptionBuilder().setLabel('Option 5').setValue('option_5'),
];

const elevenCheckboxOptions = [
	new CheckboxGroupOptionBuilder().setLabel('Option 1').setValue('option_1'),
	new CheckboxGroupOptionBuilder().setLabel('Option 2').setValue('option_2'),
	new CheckboxGroupOptionBuilder().setLabel('Option 3').setValue('option_3'),
	new CheckboxGroupOptionBuilder().setLabel('Option 4').setValue('option_4'),
	new CheckboxGroupOptionBuilder().setLabel('Option 5').setValue('option_5'),
	new CheckboxGroupOptionBuilder().setLabel('Option 6').setValue('option_6'),
	new CheckboxGroupOptionBuilder().setLabel('Option 7').setValue('option_7'),
	new CheckboxGroupOptionBuilder().setLabel('Option 8').setValue('option_8'),
	new CheckboxGroupOptionBuilder().setLabel('Option 9').setValue('option_9'),
	new CheckboxGroupOptionBuilder().setLabel('Option 10').setValue('option_10'),
	new CheckboxGroupOptionBuilder().setLabel('Option 11').setValue('option_11'),
];

const fiveRadioOptions = [
	new RadioGroupOptionBuilder().setLabel('Option 1').setValue('option_1'),
	new RadioGroupOptionBuilder().setLabel('Option 2').setValue('option_2'),
	new RadioGroupOptionBuilder().setLabel('Option 3').setValue('option_3'),
	new RadioGroupOptionBuilder().setLabel('Option 4').setValue('option_4'),
	new RadioGroupOptionBuilder().setLabel('Option 5').setValue('option_5'),
];

const elevenRadioOptions = [
	new RadioGroupOptionBuilder().setLabel('Option 1').setValue('option_1'),
	new RadioGroupOptionBuilder().setLabel('Option 2').setValue('option_2'),
	new RadioGroupOptionBuilder().setLabel('Option 3').setValue('option_3'),
	new RadioGroupOptionBuilder().setLabel('Option 4').setValue('option_4'),
	new RadioGroupOptionBuilder().setLabel('Option 5').setValue('option_5'),
	new RadioGroupOptionBuilder().setLabel('Option 6').setValue('option_6'),
	new RadioGroupOptionBuilder().setLabel('Option 7').setValue('option_7'),
	new RadioGroupOptionBuilder().setLabel('Option 8').setValue('option_8'),
	new RadioGroupOptionBuilder().setLabel('Option 9').setValue('option_9'),
	new RadioGroupOptionBuilder().setLabel('Option 10').setValue('option_10'),
	new RadioGroupOptionBuilder().setLabel('Option 11').setValue('option_11'),
];

describe('Checkbox Components', () => {
	describe('CheckboxBuilder', () => {
		test('Valid builder does not throw.', () => {
			expect(() => new CheckboxBuilder().setCustomId('checkbox').toJSON()).not.toThrowError();
			expect(() => new CheckboxBuilder().setCustomId('checkbox').setDefault(true).toJSON()).not.toThrowError();
		});

		test('Invalid builder does throw.', () => {
			expect(() => new CheckboxBuilder().toJSON()).toThrowError();
			expect(() => new CheckboxBuilder().setDefault(true).toJSON()).toThrowError();
			expect(() => new CheckboxBuilder().setCustomId(longStr).toJSON()).toThrowError();
		});

		test('API data equals toJSON().', () => {
			const checkboxData = {
				type: ComponentType.Checkbox,
				custom_id: 'checkbox',
				default: true,
			} satisfies APICheckboxComponent;

			expect(new CheckboxBuilder(checkboxData).toJSON()).toEqual(checkboxData);

			expect(new CheckboxBuilder().setCustomId('checkbox').setDefault(true).toJSON()).toEqual(checkboxData);
		});
	});

	describe('CheckboxGroupBuilder', () => {
		test('Valid builder does not throw.', () => {
			expect(() =>
				new CheckboxGroupBuilder({
					custom_id: 'checkbox_group',
					options: fiveCheckboxOptions.map((option) => option.toJSON()),
				}).toJSON(),
			).not.toThrowError();
			expect(() =>
				new CheckboxGroupBuilder().setCustomId('checkbox_group').setOptions(fiveCheckboxOptions).toJSON(),
			).not.toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setOptions([
						new CheckboxGroupOptionBuilder().setLabel('Option 1').setValue('option_1'),
						new CheckboxGroupOptionBuilder().setLabel('Option 2').setValue('option_2'),
					])
					.toJSON(),
			).not.toThrowError();
			expect(() =>
				new CheckboxGroupBuilder().setCustomId('checkbox_group').addOptions(fiveCheckboxOptions).toJSON(),
			).not.toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setMinValues(1)
					.setMaxValues(2)
					.setOptions([
						new CheckboxGroupOptionBuilder().setLabel('Option 1').setValue('option_1'),
						new CheckboxGroupOptionBuilder().setLabel('Option 2').setValue('option_2'),
					])
					.toJSON(),
			).not.toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setOptions(fiveCheckboxOptions)
					.spliceOptions(2, 1, ...elevenCheckboxOptions.slice(7, 9))
					.spliceOptions(0, 1, { label: 'New Option', value: 'new_option' }),
			).not.toThrowError();
		});

		test('Invalid builder does throw.', () => {
			expect(() => new CheckboxGroupBuilder().toJSON()).toThrowError();
			expect(() => new CheckboxGroupBuilder().addOptions([]).toJSON()).toThrowError();
			expect(() => new CheckboxGroupBuilder().setMinValues(2).setMaxValues(1).toJSON()).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder().setMinValues(2).setMaxValues(1).addOptions(fiveCheckboxOptions).toJSON(),
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setMinValues(2)
					.setMaxValues(1)
					.addOptions(fiveCheckboxOptions)
					.toJSON(),
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder().setCustomId('checkbox_group').setMinValues(5).setMaxValues(11).toJSON(),
			).toThrowError();
			expect(() => new CheckboxGroupBuilder().setCustomId('checkbox_group').setOptions([]).toJSON()).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setOptions(fiveCheckboxOptions)
					.setMinValues(6)
					.toJSON(),
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setOptions(fiveCheckboxOptions)
					.setMaxValues(6)
					.toJSON(),
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder().setCustomId('checkbox_group').setOptions(elevenCheckboxOptions).toJSON(),
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setOptions(elevenCheckboxOptions)
					.setMaxValues(12)
					.toJSON(),
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder().setCustomId(longStr).setOptions(fiveCheckboxOptions).toJSON(),
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setOptions(fiveCheckboxOptions)
					.setMinValues(0)
					.setRequired(true)
					.toJSON(),
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setMaxValues(4)
					.setOptions([
						new CheckboxGroupOptionBuilder().setLabel('Option 1').setValue('option_1').setDefault(true),
						new CheckboxGroupOptionBuilder().setLabel('Option 2').setValue('option_2').setDefault(true),
						new CheckboxGroupOptionBuilder().setLabel('Option 3').setValue('option_3').setDefault(true),
						new CheckboxGroupOptionBuilder().setLabel('Option 4').setValue('option_4').setDefault(true),
						new CheckboxGroupOptionBuilder().setLabel('Option 5').setValue('option_5').setDefault(true),
					])
					.toJSON(),
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setOptions(fiveCheckboxOptions)
					.addOptions(fiveCheckboxOptions)
					.toJSON(),
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setOptions(elevenCheckboxOptions.slice(0, 5))
					.addOptions(elevenCheckboxOptions.slice(5, 11))
					.toJSON(),
			).toThrowError();
			expect(
				() =>
					new CheckboxGroupBuilder()
						.setCustomId('checkbox_group')
						.setOptions(fiveCheckboxOptions)
						.spliceOptions(2, 1, new CheckboxGroupOptionBuilder().setLabel('Option 6')), // no value
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder()
					.setCustomId('checkbox_group')
					.setOptions(fiveCheckboxOptions)
					.spliceOptions(2, 1, { value: 'hi', label: longStr }),
			).toThrowError();
			expect(() =>
				new CheckboxGroupBuilder().setCustomId('checkbox_group').addOptions({ value: 'hi', label: longStr }),
			).toThrowError();
		});
	});

	describe('CheckboxGroupOptionBuilder', () => {
		test('Valid builder does not throw.', () => {
			expect(() =>
				new CheckboxGroupOptionBuilder().setLabel('Option 1').setValue('option_1').toJSON(),
			).not.toThrowError();
			expect(() =>
				new CheckboxGroupOptionBuilder()
					.setLabel('Option 2')
					.setValue('option_2')
					.setDescription('This is option 2')
					.toJSON(),
			).not.toThrowError();
			expect(() =>
				new CheckboxGroupOptionBuilder().setLabel('Option 3').setValue('option_3').setDefault(true).toJSON(),
			).not.toThrowError();
		});

		test('Invalid builder does throw.', () => {
			expect(() => new CheckboxGroupOptionBuilder().toJSON()).toThrowError();
			expect(() => new CheckboxGroupOptionBuilder().setValue('option_1').toJSON()).toThrowError();
			expect(() => new CheckboxGroupOptionBuilder().setLabel('Option 1').toJSON()).toThrowError();
			expect(() => new CheckboxGroupOptionBuilder().setLabel(longStr).setValue('option_1').toJSON()).toThrowError();
			expect(() => new CheckboxGroupOptionBuilder().setLabel('Option 1').setValue(longStr).toJSON()).toThrowError();
		});

		test('toJSON returns correct data.', () => {
			const option = new CheckboxGroupOptionBuilder()
				.setLabel('Option 1')
				.setValue('option_1')
				.setDescription('This is option 1')
				.setDefault(true);

			expect(option.toJSON()).toEqual({
				label: 'Option 1',
				value: 'option_1',
				description: 'This is option 1',
				default: true,
			});
		});
	});

	describe('RadioGroupBuilder', () => {
		test('Valid builder does not throw.', () => {
			expect(() =>
				new RadioGroupBuilder().setCustomId('radio_group').addOptions(fiveRadioOptions).toJSON(),
			).not.toThrowError();
			expect(() =>
				new RadioGroupBuilder()
					.setCustomId('radio_group')
					.setOptions([
						new RadioGroupOptionBuilder().setLabel('Option 1').setValue('option_1'),
						new RadioGroupOptionBuilder().setLabel('Option 2').setValue('option_2'),
					])
					.toJSON(),
			).not.toThrowError();
			expect(() =>
				new RadioGroupBuilder().setCustomId('radio_group').addOptions(fiveRadioOptions).setRequired(false),
			).not.toThrowError();
			expect(() =>
				new RadioGroupBuilder().setCustomId('radio_group').addOptions(fiveRadioOptions).setRequired(true),
			).not.toThrowError();
			expect(() => new RadioGroupBuilder().setCustomId('radio_group').setOptions(fiveRadioOptions)).not.toThrowError();
			expect(() =>
				new RadioGroupBuilder()
					.setCustomId('radio_group')
					.setOptions(fiveRadioOptions)
					.spliceOptions(2, 1, elevenRadioOptions.slice(7, 9)),
			).not.toThrowError();
			expect(() =>
				new RadioGroupBuilder()
					.setCustomId('radio_group')
					.addOptions(elevenRadioOptions.slice(0, 5))
					.spliceOptions(0, 1, { label: 'New Option', value: 'new_option' }),
			).not.toThrowError();
			expect(() =>
				new RadioGroupBuilder({
					custom_id: 'radio_group',
					options: fiveRadioOptions.map((option) => option.toJSON()),
				}).toJSON(),
			).not.toThrowError();
			expect(() =>
				new RadioGroupBuilder()
					.setCustomId('radio_group')
					.addOptions(fiveRadioOptions.map((option) => option.toJSON()))
					.toJSON(),
			).not.toThrowError();
		});

		test('Invalid builder does throw.', () => {
			expect(() => new RadioGroupBuilder().toJSON()).toThrowError();
			expect(() => new RadioGroupBuilder().addOptions([]).toJSON()).toThrowError();
			// needs at least 2 options
			expect(() => new RadioGroupBuilder().addOptions([fiveRadioOptions[0]]).toJSON()).toThrowError();
			expect(() =>
				new RadioGroupBuilder().setCustomId('radio_group').setOptions([fiveRadioOptions[0]]).toJSON(),
			).toThrowError();
			expect(() => new RadioGroupBuilder().setCustomId('radio_group').setOptions([]).toJSON()).toThrowError();
			expect(() =>
				new RadioGroupBuilder().setCustomId('radio_group').setOptions(elevenRadioOptions).toJSON(),
			).toThrowError();
			expect(() => new RadioGroupBuilder().setCustomId(longStr).setOptions(fiveRadioOptions).toJSON()).toThrowError();
			expect(() =>
				new RadioGroupBuilder()
					.setCustomId('radio_group')
					.setOptions([
						new RadioGroupOptionBuilder().setLabel('Option 1').setValue('option_1').setDefault(true),
						new RadioGroupOptionBuilder().setLabel('Option 2').setValue('option_2').setDefault(true),
					])
					.toJSON(),
			).toThrowError();
			expect(() =>
				new RadioGroupBuilder()
					.setCustomId('radio_group')
					.addOptions(fiveRadioOptions)
					.addOptions(fiveRadioOptions)
					.toJSON(),
			).toThrowError();
			expect(() =>
				new RadioGroupBuilder()
					.setCustomId('radio_group')
					.setOptions(fiveRadioOptions)
					.spliceOptions(2, 1, { value: 'hi', label: longStr }),
			).toThrowError();
			expect(() =>
				new RadioGroupBuilder().setCustomId('radio_group').addOptions({ value: 'hi', label: longStr }),
			).toThrowError();
		});
	});

	describe('RadioGroupOptionBuilder', () => {
		test('Valid builder does not throw.', () => {
			expect(() => new RadioGroupOptionBuilder().setLabel('Option 1').setValue('option_1').toJSON()).not.toThrowError();
			expect(() =>
				new RadioGroupOptionBuilder()
					.setLabel('Option 2')
					.setValue('option_2')
					.setDescription('This is option 2')
					.toJSON(),
			).not.toThrowError();
			expect(() =>
				new RadioGroupOptionBuilder().setLabel('Option 3').setValue('option_3').setDefault(true).toJSON(),
			).not.toThrowError();
		});

		test('Invalid builder does throw.', () => {
			expect(() => new RadioGroupOptionBuilder().toJSON()).toThrowError();
			expect(() => new RadioGroupOptionBuilder().setValue('option_1').toJSON()).toThrowError();
			expect(() => new RadioGroupOptionBuilder().setLabel('Option 1').toJSON()).toThrowError();
			expect(() => new RadioGroupOptionBuilder().setLabel(longStr).setValue('option_1').toJSON()).toThrowError();
			expect(() => new RadioGroupOptionBuilder().setLabel('Option 1').setValue(longStr).toJSON()).toThrowError();
		});

		test('toJSON returns correct data.', () => {
			const option = new RadioGroupOptionBuilder()
				.setLabel('Option 1')
				.setValue('option_1')
				.setDescription('This is option 1')
				.setDefault(true);

			expect(option.toJSON()).toEqual({
				label: 'Option 1',
				value: 'option_1',
				description: 'This is option 1',
				default: true,
			});
		});
	});
});

describe('LabelBuilder with Checkbox Components', () => {
	test('LabelBuilder can set Checkbox component.', () => {
		const checkbox = new CheckboxBuilder().setCustomId('checkbox').setDefault(true);
		const label = new LabelBuilder().setLabel('Checkbox Label').setCheckboxComponent(checkbox);
		expect(() => label.toJSON()).not.toThrowError();
		expect(label.toJSON().component).toEqual(checkbox.toJSON());
	});

	test('LabelBuilder can set CheckboxGroup component.', () => {
		const checkboxGroup = new CheckboxGroupBuilder().setCustomId('checkbox_group').setOptions(fiveCheckboxOptions);
		const label = new LabelBuilder().setLabel('Checkbox Group Label').setCheckboxGroupComponent(checkboxGroup);
		expect(() => label.toJSON()).not.toThrowError();
		expect(label.toJSON().component).toEqual(checkboxGroup.toJSON());
	});

	test('LabelBuilder can set RadioGroup component.', () => {
		const radioGroup = new RadioGroupBuilder().setCustomId('radio_group').setOptions(fiveRadioOptions);
		const label = new LabelBuilder().setLabel('Radio Group Label').setRadioGroupComponent(radioGroup);
		expect(() => label.toJSON()).not.toThrowError();
		expect(label.toJSON().component).toEqual(radioGroup.toJSON());
	});
});
