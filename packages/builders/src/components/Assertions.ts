import { ButtonStyle, ChannelType, ComponentType, SelectMenuDefaultValueType } from 'discord-api-types/v10';
import { z } from 'zod';
import { idPredicate, customIdPredicate } from '../Assertions.js';

const labelPredicate = z.string().min(1).max(80);

export const emojiPredicate = z
	.strictObject({
		id: z.string().optional(),
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
	sku_id: z.string(),
});

export const buttonPredicate = z.discriminatedUnion('style', [
	buttonLinkPredicate,
	buttonPrimaryPredicate,
	buttonSecondaryPredicate,
	buttonSuccessPredicate,
	buttonDangerPredicate,
	buttonPremiumPredicate,
]);

const selectMenuBasePredicate = z.object({
	id: idPredicate,
	placeholder: z.string().max(150).optional(),
	min_values: z.number().min(0).max(25).optional(),
	max_values: z.number().min(0).max(25).optional(),
	custom_id: customIdPredicate,
	disabled: z.boolean().optional(),
});

export const selectMenuChannelPredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.ChannelSelect),
	channel_types: z.enum(ChannelType).array().optional(),
	default_values: z
		.object({ id: z.string(), type: z.literal(SelectMenuDefaultValueType.Channel) })
		.array()
		.max(25)
		.optional(),
});

export const selectMenuMentionablePredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.MentionableSelect),
	default_values: z
		.object({
			id: z.string(),
			type: z.literal([SelectMenuDefaultValueType.Role, SelectMenuDefaultValueType.User]),
		})
		.array()
		.max(25)
		.optional(),
});

export const selectMenuRolePredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.RoleSelect),
	default_values: z
		.object({ id: z.string(), type: z.literal(SelectMenuDefaultValueType.Role) })
		.array()
		.max(25)
		.optional(),
});

export const selectMenuStringOptionPredicate = z.object({
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
	.check((ctx) => {
		const addIssue = (name: string, minimum: number) =>
			ctx.issues.push({
				code: 'too_small',
				message: `The number of options must be greater than or equal to ${name}`,
				inclusive: true,
				minimum,
				type: 'number',
				path: ['options'],
				origin: 'number',
				input: minimum,
			});

		if (ctx.value.min_values !== undefined && ctx.value.options.length < ctx.value.min_values) {
			addIssue('min_values', ctx.value.min_values);
		}

		if (
			ctx.value.min_values !== undefined &&
			ctx.value.max_values !== undefined &&
			ctx.value.min_values > ctx.value.max_values
		) {
			ctx.issues.push({
				code: 'too_big',
				message: `The maximum amount of options must be greater than or equal to the minimum amount of options`,
				inclusive: true,
				maximum: ctx.value.max_values,
				type: 'number',
				path: ['min_values'],
				origin: 'number',
				input: ctx.value.min_values,
			});
		}
	});

export const selectMenuUserPredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.UserSelect),
	default_values: z
		.object({ id: z.string(), type: z.literal(SelectMenuDefaultValueType.User) })
		.array()
		.max(25)
		.optional(),
});

export const actionRowPredicate = z.object({
	id: idPredicate,
	type: z.literal(ComponentType.ActionRow),
	components: z.union([
		z
			.object({ type: z.literal(ComponentType.Button) })
			.array()
			.min(1)
			.max(5),
		z
			.object({
				type: z.literal([
					ComponentType.ChannelSelect,
					ComponentType.MentionableSelect,
					ComponentType.StringSelect,
					ComponentType.RoleSelect,
					ComponentType.TextInput,
					ComponentType.UserSelect,
				]),
			})
			.array()
			.length(1),
	]),
});
