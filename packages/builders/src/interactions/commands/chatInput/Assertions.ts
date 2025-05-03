import {
	ApplicationIntegrationType,
	InteractionContextType,
	ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import type { ZodTypeAny } from 'zod';
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
	channel_types: z
		.union(
			ApplicationCommandOptionAllowedChannelTypes.map((type) => z.literal(type)) as unknown as [
				ZodTypeAny,
				ZodTypeAny,
				...ZodTypeAny[],
			],
		)
		.array()
		.optional(),
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
const choiceStringPredicate = choiceBasePredicate.extend({
	value: choiceValueStringPredicate,
});
const choiceNumberPredicate = choiceBasePredicate.extend({
	value: choiceValueNumberPredicate,
});

const choiceBaseMixinPredicate = z.object({
	autocomplete: z.literal(false).optional(),
});
const choiceStringMixinPredicate = choiceBaseMixinPredicate.extend({
	choices: choiceStringPredicate.array().max(25).optional(),
});
const choiceNumberMixinPredicate = choiceBaseMixinPredicate.extend({
	choices: choiceNumberPredicate.array().max(25).optional(),
});

const basicOptionTypes = [
	ApplicationCommandOptionType.Attachment,
	ApplicationCommandOptionType.Boolean,
	ApplicationCommandOptionType.Channel,
	ApplicationCommandOptionType.Integer,
	ApplicationCommandOptionType.Mentionable,
	ApplicationCommandOptionType.Number,
	ApplicationCommandOptionType.Role,
	ApplicationCommandOptionType.String,
	ApplicationCommandOptionType.User,
] as const;

const basicOptionTypesPredicate = z.union(
	basicOptionTypes.map((type) => z.literal(type)) as unknown as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]],
);

export const basicOptionPredicate = sharedNameAndDescriptionPredicate.extend({
	required: z.boolean().optional(),
	type: basicOptionTypesPredicate,
});

const autocompleteOrStringChoicesMixinOptionPredicate = z.discriminatedUnion('autocomplete', [
	autocompleteMixinOptionPredicate,
	choiceStringMixinPredicate,
]);

const autocompleteOrNumberChoicesMixinOptionPredicate = z.discriminatedUnion('autocomplete', [
	autocompleteMixinOptionPredicate,
	choiceNumberMixinPredicate,
]);

export const channelOptionPredicate = basicOptionPredicate.merge(channelMixinOptionPredicate);

export const integerOptionPredicate = basicOptionPredicate
	.merge(numericMixinIntegerOptionPredicate)
	.and(autocompleteOrNumberChoicesMixinOptionPredicate);

export const numberOptionPredicate = basicOptionPredicate
	.merge(numericMixinNumberOptionPredicate)
	.and(autocompleteOrNumberChoicesMixinOptionPredicate);

export const stringOptionPredicate = basicOptionPredicate
	.extend({
		max_length: z.number().min(0).max(6_000).optional(),
		min_length: z.number().min(1).max(6_000).optional(),
	})
	.and(autocompleteOrStringChoicesMixinOptionPredicate);

const baseChatInputCommandPredicate = sharedNameAndDescriptionPredicate.extend({
	contexts: z.array(z.nativeEnum(InteractionContextType)).optional(),
	default_member_permissions: memberPermissionsPredicate.optional(),
	integration_types: z.array(z.nativeEnum(ApplicationIntegrationType)).optional(),
	nsfw: z.boolean().optional(),
});

// Because you can only add options via builders, there's no need to validate whole objects here otherwise
const chatInputCommandOptionsPredicate = z.union([
	z.object({ type: basicOptionTypesPredicate }).array(),
	z.object({ type: z.literal(ApplicationCommandOptionType.Subcommand) }).array(),
	z.object({ type: z.literal(ApplicationCommandOptionType.SubcommandGroup) }).array(),
]);

export const chatInputCommandPredicate = baseChatInputCommandPredicate.extend({
	options: chatInputCommandOptionsPredicate.optional(),
});

export const chatInputCommandSubcommandGroupPredicate = sharedNameAndDescriptionPredicate.extend({
	type: z.literal(ApplicationCommandOptionType.SubcommandGroup),
	options: z
		.array(z.object({ type: z.literal(ApplicationCommandOptionType.Subcommand) }))
		.min(1)
		.max(25),
});

export const chatInputCommandSubcommandPredicate = sharedNameAndDescriptionPredicate.extend({
	type: z.literal(ApplicationCommandOptionType.Subcommand),
	options: z.array(z.object({ type: basicOptionTypesPredicate })).max(25),
});
