import { Result, s } from '@sapphire/shapeshift';
import { ComponentType } from 'discord-api-types/v10';
import { isValidationEnabled } from '../../util/validation';
import { customIdValidator, idValidator } from '../Assertions';

export const checkboxPredicate = s
	.object({
		type: s.literal(ComponentType.Checkbox),
		custom_id: customIdValidator,
		id: idValidator.optional(),
		default: s.boolean().optional(),
	})
	.setValidationEnabled(isValidationEnabled);

export const checkboxGroupOptionPredicate = s
	.object({
		label: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100),
		value: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100),
		description: s.string().lengthLessThanOrEqual(100).optional(),
		default: s.boolean().optional(),
	})
	.setValidationEnabled(isValidationEnabled);

export const checkboxGroupPredicate = s
	.object({
		type: s.literal(ComponentType.CheckboxGroup),
		custom_id: customIdValidator,
		id: idValidator.optional(),
		options: s.array(checkboxGroupOptionPredicate).lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(10),
		min_values: s.number().int().greaterThanOrEqual(0).lessThanOrEqual(10).optional(),
		max_values: s.number().int().greaterThanOrEqual(1).lessThanOrEqual(10).optional(),
		required: s.boolean().optional(),
	})
	.reshape((data) => {
		// Ensure min_values is not greater than max_values
		if (data.min_values !== undefined && data.max_values !== undefined && data.min_values > data.max_values) {
			throw new RangeError('min_values cannot be greater than max_values');
		}

		// Ensure max_values is not greater than the number of options
		if (data.max_values !== undefined && data.max_values > data.options.length) {
			throw new RangeError('max_values cannot be greater than the number of options');
		}

		// Ensure min_values is not greater than the number of options
		if (data.min_values !== undefined && data.min_values > data.options.length) {
			throw new RangeError('min_values cannot be greater than the number of options');
		}

		// Ensure required is consistent with min_values
		if (data.required === true && data.min_values === 0) {
			throw new RangeError('If required is true, min_values must be at least 1');
		}

		// Ensure there are not more default values than max_values
		const defaultCount = data.options.filter((option) => option.default === true).length;
		if (data.max_values !== undefined && defaultCount > data.max_values) {
			throw new RangeError('The number of default options cannot be greater than max_values');
		}

		// Ensure each option's value is unique
		const values = data.options.map((option) => option.value);
		const uniqueValues = new Set(values);
		if (uniqueValues.size !== values.length) {
			throw new RangeError('Each option in a checkbox group must have a unique value');
		}

		return Result.ok(data);
	})
	.setValidationEnabled(isValidationEnabled);

export const radioGroupOptionPredicate = checkboxGroupOptionPredicate;

export const radioGroupPredicate = s
	.object({
		type: s.literal(ComponentType.RadioGroup),
		custom_id: customIdValidator,
		id: idValidator.optional(),
		options: s.array(radioGroupOptionPredicate).lengthGreaterThanOrEqual(2).lengthLessThanOrEqual(10),
		required: s.boolean().optional(),
	})
	.reshape((data) => {
		// Ensure there is exactly one default option
		const defaultCount = data.options.filter((option) => option.default === true).length;
		if (defaultCount > 1) {
			throw new RangeError('There can be at most one default option in a radio group');
		}

		// Ensure each option's value is unique
		const values = data.options.map((option) => option.value);
		const uniqueValues = new Set(values);
		if (uniqueValues.size !== values.length) {
			throw new RangeError('Each option in a radio group must have a unique value');
		}

		return Result.ok(data);
	})
	.setValidationEnabled(isValidationEnabled);
