import {
	ApplicationIntegrationType,
	InteractionContextType,
	ApplicationCommandOptionType,
	ApplicationCommandType,
} from 'discord-api-types/v10';
import { z } from 'zod';
import { localeMapPredicate, memberPermissionsPredicate } from '../../../Assertions.js';
import { ApplicationCommandOptionAllowedChannelTypes } from './mixins/ApplicationCommandOptionChannelTypesMixin.js';

const namePredicate = z
	.string()
	.min(1)
	.max(32)
	.regex(/^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u);

const descriptionPredicate = z.string().min(1).max(100);

const sharedNameAndDescriptionPredicate = z.object({
	name: namePredicate,
	name_localizations: localeMapPredicate.optional(),
	description: descriptionPredicate,
	description_localizations: localeMapPredicate.optional(),
});

const numericMixinNumberOptionPredicate = z.object({
	max_value: z.float32().optional(),
	min_value: z.float32().optional(),
});

const numericMixinIntegerOptionPredicate = z.object({
	max_value: z.int().optional(),
	min_value: z.int().optional(),
});

const channelMixinOptionPredicate = z.object({
	channel_types: z.literal(ApplicationCommandOptionAllowedChannelTypes).array().optional(),
});

const autocompleteMixinOptionPredicate = z.object({
	autocomplete: z.literal(true),
	choices: z.union([z.never(), z.never().array(), z.undefined()]),
});

const choiceValueStringPredicate = z.string().min(1).max(100);
const choiceValueNumberPredicate = z.number();
const choiceBasePredicate = z.object({
	name: choiceValueStringPredicate,
	name_localizations: localeMapPredicate.optional(),
});
const choiceStringPredicate = z.object({
	...choiceBasePredicate.shape,
	value: choiceValueStringPredicate,
});
const choiceNumberPredicate = z.object({
	...choiceBasePredicate.shape,
	value: choiceValueNumberPredicate,
});

const choiceBaseMixinPredicate = z.object({
	autocomplete: z.literal(false).optional(),
});
const choiceStringMixinPredicate = z.object({
	...choiceBaseMixinPredicate.shape,
	choices: choiceStringPredicate.array().max(25).optional(),
});
const choiceNumberMixinPredicate = z.object({
	...choiceBaseMixinPredicate.shape,
	choices: choiceNumberPredicate.array().max(25).optional(),
});

export const baseBasicOptionPredicate = z.object({
	...sharedNameAndDescriptionPredicate.shape,
	required: z.boolean().optional(),
});

export const attachmentOptionPredicate = z.object({
	...baseBasicOptionPredicate.shape,
	type: z.literal(ApplicationCommandOptionType.Attachment),
});

export const booleanOptionPredicate = z.object({
	...baseBasicOptionPredicate.shape,
	type: z.literal(ApplicationCommandOptionType.Boolean),
});

export const mentionableOptionPredicate = z.object({
	...baseBasicOptionPredicate.shape,
	type: z.literal(ApplicationCommandOptionType.Mentionable),
});

export const roleOptionPredicate = z.object({
	...baseBasicOptionPredicate.shape,
	type: z.literal(ApplicationCommandOptionType.Role),
});

export const userOptionPredicate = z.object({
	...baseBasicOptionPredicate.shape,
	type: z.literal(ApplicationCommandOptionType.User),
});

const autocompleteOrStringChoicesMixinOptionPredicate = z.discriminatedUnion('autocomplete', [
	autocompleteMixinOptionPredicate,
	choiceStringMixinPredicate,
]);

const autocompleteOrNumberChoicesMixinOptionPredicate = z.discriminatedUnion('autocomplete', [
	autocompleteMixinOptionPredicate,
	choiceNumberMixinPredicate,
]);

export const channelOptionPredicate = z.object({
	...baseBasicOptionPredicate.shape,
	...channelMixinOptionPredicate.shape,
	type: z.literal(ApplicationCommandOptionType.Channel),
});

export const integerOptionPredicate = z
	.object({
		...baseBasicOptionPredicate.shape,
		...numericMixinIntegerOptionPredicate.shape,
		type: z.literal(ApplicationCommandOptionType.Integer),
	})
	.and(autocompleteOrNumberChoicesMixinOptionPredicate);

export const numberOptionPredicate = z
	.object({
		...baseBasicOptionPredicate.shape,
		...numericMixinNumberOptionPredicate.shape,
		type: z.literal(ApplicationCommandOptionType.Number),
	})
	.and(autocompleteOrNumberChoicesMixinOptionPredicate);

export const stringOptionPredicate = z
	.object({
		...baseBasicOptionPredicate.shape,
		max_length: z.number().min(0).max(6_000).optional(),
		min_length: z.number().min(1).max(6_000).optional(),
		type: z.literal(ApplicationCommandOptionType.String),
	})
	.and(autocompleteOrStringChoicesMixinOptionPredicate);

const basicOptionPredicates = [
	attachmentOptionPredicate,
	booleanOptionPredicate,
	channelOptionPredicate,
	integerOptionPredicate,
	mentionableOptionPredicate,
	numberOptionPredicate,
	roleOptionPredicate,
	stringOptionPredicate,
	userOptionPredicate,
];

export const chatInputCommandSubcommandPredicate = z.object({
	...sharedNameAndDescriptionPredicate.shape,
	type: z.literal(ApplicationCommandOptionType.Subcommand),
	options: z.array(z.union(basicOptionPredicates)).max(25).optional(),
});

export const chatInputCommandSubcommandGroupPredicate = z.object({
	...sharedNameAndDescriptionPredicate.shape,
	type: z.literal(ApplicationCommandOptionType.SubcommandGroup),
	options: z.array(chatInputCommandSubcommandPredicate).min(1).max(25),
});

export const chatInputCommandPredicate = z.object({
	...sharedNameAndDescriptionPredicate.shape,
	contexts: z.array(z.enum(InteractionContextType)).optional(),
	default_member_permissions: memberPermissionsPredicate.optional(),
	integration_types: z.array(z.enum(ApplicationIntegrationType)).optional(),
	nsfw: z.boolean().optional(),
	options: z
		.union([
			z.array(z.union(basicOptionPredicates)).max(25),
			z.array(z.union([chatInputCommandSubcommandPredicate, chatInputCommandSubcommandGroupPredicate])).max(25),
		])
		.optional(),
	type: z.literal(ApplicationCommandType.ChatInput).optional(),
});
