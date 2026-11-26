import { ComponentType } from 'discord-api-types/v10';
import { z } from 'zod';
import { customIdPredicate, idPredicate } from '../../Assertions.js';

export const checkboxPredicate = z.object({
	type: z.literal(ComponentType.Checkbox),
	id: idPredicate,
	custom_id: customIdPredicate,
	default: z.boolean().optional(),
});

export const checkboxGroupOptionPredicate = z.object({
	label: z.string().min(1).max(100),
	value: z.string().min(1).max(100),
	description: z.string().max(100).optional(),
	default: z.boolean().optional(),
});

export const radioGroupOptionPredicate = checkboxGroupOptionPredicate;

function hasUniqueValues(options: readonly { value: string }[]) {
	return new Set(options.map((option) => option.value)).size === options.length;
}

function countDefaults(options: readonly { default?: boolean | undefined }[]) {
	return options.filter((option) => option.default === true).length;
}

export const checkboxGroupPredicate = z
	.object({
		type: z.literal(ComponentType.CheckboxGroup),
		id: idPredicate,
		custom_id: customIdPredicate,
		options: checkboxGroupOptionPredicate.array().min(1).max(10),
		min_values: z.int().min(0).max(10).optional(),
		max_values: z.int().min(1).max(10).optional(),
		required: z.boolean().optional(),
	})
	.check((ctx) => {
		const { min_values, max_values, options, required } = ctx.value;
		const addIssue = (message: string, path: string) =>
			ctx.issues.push({ code: 'custom', message, path: [path], input: ctx.value });

		if (min_values !== undefined && max_values !== undefined && min_values > max_values) {
			addIssue('min_values cannot be greater than max_values', 'min_values');
		}

		if (max_values !== undefined && max_values > options.length) {
			addIssue('max_values cannot be greater than the number of options', 'max_values');
		}

		if (min_values !== undefined && min_values > options.length) {
			addIssue('min_values cannot be greater than the number of options', 'min_values');
		}

		if (required !== false && min_values === 0) {
			addIssue('min_values must be at least 1 unless required is false', 'min_values');
		}

		if (max_values !== undefined && countDefaults(options) > max_values) {
			addIssue('The number of default options cannot be greater than max_values', 'options');
		}

		if (!hasUniqueValues(options)) {
			addIssue('Each option in a checkbox group must have a unique value', 'options');
		}
	});

export const radioGroupPredicate = z
	.object({
		type: z.literal(ComponentType.RadioGroup),
		id: idPredicate,
		custom_id: customIdPredicate,
		options: radioGroupOptionPredicate.array().min(2).max(10),
		required: z.boolean().optional(),
	})
	.check((ctx) => {
		const { options } = ctx.value;
		const addIssue = (message: string) =>
			ctx.issues.push({ code: 'custom', message, path: ['options'], input: ctx.value });

		if (countDefaults(options) > 1) {
			addIssue('There can be at most one default option in a radio group');
		}

		if (!hasUniqueValues(options)) {
			addIssue('Each option in a radio group must have a unique value');
		}
	});
