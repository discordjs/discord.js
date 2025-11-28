import { Result, s } from '@sapphire/shapeshift';
import { ChannelType, ComponentType, SelectMenuDefaultValueType } from 'discord-api-types/v10';
import { isValidationEnabled } from '../../util/validation.js';
import { customIdValidator, emojiValidator, idValidator } from '../Assertions.js';

const selectMenuBasePredicate = s.object({
	id: idValidator.optional(),
	placeholder: s.string().lengthLessThanOrEqual(150).optional(),
	min_values: s.number().greaterThanOrEqual(0).lessThanOrEqual(25).optional(),
	max_values: s.number().greaterThanOrEqual(0).lessThanOrEqual(25).optional(),
	custom_id: customIdValidator,
	disabled: s.boolean().optional(),
});

export const selectMenuChannelPredicate = selectMenuBasePredicate
	.extend({
		type: s.literal(ComponentType.ChannelSelect),
		channel_types: s.nativeEnum(ChannelType).array().optional(),
		default_values: s
			.object({ id: s.string(), type: s.literal(SelectMenuDefaultValueType.Channel) })
			.array()
			.lengthLessThanOrEqual(25)
			.optional(),
	})
	.setValidationEnabled(isValidationEnabled);

export const selectMenuMentionablePredicate = selectMenuBasePredicate
	.extend({
		type: s.literal(ComponentType.MentionableSelect),
		default_values: s
			.object({
				id: s.string(),
				type: s.union([s.literal(SelectMenuDefaultValueType.Role), s.literal(SelectMenuDefaultValueType.User)]),
			})
			.array()
			.lengthLessThanOrEqual(25)
			.optional(),
	})
	.setValidationEnabled(isValidationEnabled);

export const selectMenuRolePredicate = selectMenuBasePredicate
	.extend({
		type: s.literal(ComponentType.RoleSelect),
		default_values: s
			.object({ id: s.string(), type: s.literal(SelectMenuDefaultValueType.Role) })
			.array()
			.lengthLessThanOrEqual(25)
			.optional(),
	})
	.setValidationEnabled(isValidationEnabled);

export const selectMenuUserPredicate = selectMenuBasePredicate
	.extend({
		type: s.literal(ComponentType.UserSelect),
		default_values: s
			.object({ id: s.string(), type: s.literal(SelectMenuDefaultValueType.User) })
			.array()
			.lengthLessThanOrEqual(25)
			.optional(),
	})
	.setValidationEnabled(isValidationEnabled);

export const selectMenuStringOptionPredicate = s
	.object({
		label: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100),
		value: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100),
		description: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100).optional(),
		emoji: emojiValidator.optional(),
		default: s.boolean().optional(),
	})
	.setValidationEnabled(isValidationEnabled);

export const selectMenuStringPredicate = selectMenuBasePredicate
	.extend({
		type: s.literal(ComponentType.StringSelect),
		options: selectMenuStringOptionPredicate.array().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(25),
	})
	.reshape((value) => {
		if (value.min_values !== undefined && value.options.length < value.min_values) {
			return Result.err(new RangeError(`The number of options must be greater than or equal to min_values`));
		}

		if (value.min_values !== undefined && value.max_values !== undefined && value.min_values > value.max_values) {
			return Result.err(
				new RangeError(`The maximum amount of options must be greater than or equal to the minimum amount of options`),
			);
		}

		return Result.ok(value);
	})
	.setValidationEnabled(isValidationEnabled);
