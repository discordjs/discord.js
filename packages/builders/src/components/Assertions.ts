import { ButtonStyle, ChannelType, ComponentType, SelectMenuDefaultValueType } from 'discord-api-types/v10';
import { z } from 'zod';
import { customIdPredicate, idPredicate, snowflakePredicate } from '../Assertions.js';

const labelPredicate = z.string().min(1).max(80);

export const emojiPredicate = z
	.strictObject({
		id: snowflakePredicate.optional(),
		name: z.string().min(2).max(32).optional(),
		animated: z.boolean().optional(),
	})
	.refine((data) => data.id !== undefined || data.name !== undefined, {
		error: "Either 'id' or 'name' must be provided",
	});

const buttonPredicateBase = z.strictObject({
	type: z.literal(ComponentType.Button),
	disabled: z.boolean().optional(),
});

const buttonCustomIdPredicateBase = buttonPredicateBase.extend({
	custom_id: customIdPredicate,
	emoji: emojiPredicate.optional(),
	label: labelPredicate,
});

const buttonPrimaryPredicate = buttonCustomIdPredicateBase.extend({ style: z.literal(ButtonStyle.Primary) });
const buttonSecondaryPredicate = buttonCustomIdPredicateBase.extend({ style: z.literal(ButtonStyle.Secondary) });
const buttonSuccessPredicate = buttonCustomIdPredicateBase.extend({ style: z.literal(ButtonStyle.Success) });
const buttonDangerPredicate = buttonCustomIdPredicateBase.extend({ style: z.literal(ButtonStyle.Danger) });

const buttonLinkPredicate = buttonPredicateBase.extend({
	style: z.literal(ButtonStyle.Link),
	url: z.url({ protocol: /^(?:https?|discord)$/ }).max(512),
	emoji: emojiPredicate.optional(),
	label: labelPredicate,
});

const buttonPremiumPredicate = buttonPredicateBase.extend({
	style: z.literal(ButtonStyle.Premium),
	sku_id: snowflakePredicate,
});

export const buttonPredicate = z.discriminatedUnion('style', [
	buttonLinkPredicate,
	buttonPrimaryPredicate,
	buttonSecondaryPredicate,
	buttonSuccessPredicate,
	buttonDangerPredicate,
	buttonPremiumPredicate,
]);

const selectMenuBasePredicate = z.strictObject({
	id: idPredicate,
	placeholder: z.string().max(150).optional(),
	min_values: z.number().min(0).max(25).optional(),
	max_values: z.number().min(0).max(25).optional(),
	custom_id: customIdPredicate,
	disabled: z.boolean().optional(),
});

export const selectMenuChannelPredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.ChannelSelect),
	channel_types: z.nativeEnum(ChannelType).array().optional(),
	default_values: z
		.strictObject({ id: snowflakePredicate, type: z.literal(SelectMenuDefaultValueType.Channel) })
		.array()
		.max(25)
		.optional(),
});

export const selectMenuMentionablePredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.MentionableSelect),
	default_values: z
		.strictObject({
			id: snowflakePredicate,
			type: z.union([
				z.literal(SelectMenuDefaultValueType.Role),
				z.literal(SelectMenuDefaultValueType.User),
			]),
		})
		.array()
		.max(25)
		.optional(),
});

export const selectMenuRolePredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.RoleSelect),
	default_values: z
		.strictObject({ id: snowflakePredicate, type: z.literal(SelectMenuDefaultValueType.Role) })
		.array()
		.max(25)
		.optional(),
});

export const selectMenuStringOptionPredicate = z.strictObject({
	label: labelPredicate,
	value: z.string().min(1).max(100),
	description: z.string().min(1).max(100).optional(),
	emoji: emojiPredicate.optional(),
	default: z.boolean().optional(),
});

export const selectMenuStringPredicate = selectMenuBasePredicate
	.extend({
		type: z.literal(ComponentType.StringSelect),
		options: selectMenuStringOptionPredicate.array().min(1).max(25),
	})
	.superRefine((value, ctx) => {
		if (value.min_values !== undefined && value.options.length < value.min_values) {
			ctx.addIssue({
				code: z.ZodIssueCode.too_small,
				minimum: value.min_values,
				type: 'array',
				inclusive: true,
				path: ['options'],
				message: `The number of options must be greater than or equal to min_values`,
			});
		}

		if (value.min_values !== undefined && value.max_values !== undefined && value.min_values > value.max_values) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['min_values'],
				message: `The maximum amount of options must be greater than or equal to the minimum amount of options`,
			});
		}
	});

export const selectMenuUserPredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.UserSelect),
	default_values: z
		.strictObject({ id: snowflakePredicate, type: z.literal(SelectMenuDefaultValueType.User) })
		.array()
		.max(25)
		.optional(),
});

export const actionRowPredicate = z.strictObject({
	id: idPredicate,
	type: z.literal(ComponentType.ActionRow),
	components: z.union([
		z
			.strictObject({ type: z.literal(ComponentType.Button) })
			.array()
			.min(1)
			.max(5),
		z
			.strictObject({
				type: z.union([
					z.literal(ComponentType.ChannelSelect),
					z.literal(ComponentType.MentionableSelect),
					z.literal(ComponentType.StringSelect),
					z.literal(ComponentType.RoleSelect),
					z.literal(ComponentType.TextInput),
					z.literal(ComponentType.UserSelect),
				]),
			})
			.array()
			.length(1),
	]),
});
