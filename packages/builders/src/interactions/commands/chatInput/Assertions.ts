import {
	ApplicationIntegrationType,
	InteractionContextType,
	ApplicationCommandOptionType,
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

const basicOptionTypesPredicate = z.literal([
	ApplicationCommandOptionType.Attachment,
	ApplicationCommandOptionType.Boolean,
	ApplicationCommandOptionType.Channel,
	ApplicationCommandOptionType.Integer,
	ApplicationCommandOptionType.Mentionable,
	ApplicationCommandOptionType.Number,
	ApplicationCommandOptionType.Role,
	ApplicationCommandOptionType.String,
	ApplicationCommandOptionType.User,
]);

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

export const channelOptionPredicate = z.object({
	...basicOptionPredicate.shape,
	...channelMixinOptionPredicate.shape,
});

export const integerOptionPredicate = z
	.object({
		...basicOptionPredicate.shape,
		...numericMixinIntegerOptionPredicate.shape,
	})
	.and(autocompleteOrNumberChoicesMixinOptionPredicate);

export const numberOptionPredicate = z
	.object({
		...basicOptionPredicate.shape,
		...numericMixinNumberOptionPredicate.shape,
	})
	.and(autocompleteOrNumberChoicesMixinOptionPredicate);

export const stringOptionPredicate = basicOptionPredicate
	.extend({
		max_length: z.number().min(0).max(6_000).optional(),
		min_length: z.number().min(1).max(6_000).optional(),
	})
	.and(autocompleteOrStringChoicesMixinOptionPredicate);

// Full predicate for all basic option types (used for nested validation in subcommands)
// This validates all possible properties that any basic option might have
const fullBasicOptionPredicate = sharedNameAndDescriptionPredicate
	.extend({
		type: basicOptionTypesPredicate,
		required: z.boolean().optional(),
		// String option properties
		max_length: z.number().min(0).max(6_000).optional(),
		min_length: z.number().min(1).max(6_000).optional(),
		// Number/Integer option properties
		max_value: z.union([z.int(), z.float32()]).optional(),
		min_value: z.union([z.int(), z.float32()]).optional(),
		// Channel option properties
		channel_types: z.literal(ApplicationCommandOptionAllowedChannelTypes).array().optional(),
		// Choice/Autocomplete properties (shared by String, Number, Integer)
		autocomplete: z.boolean().optional(),
		choices: z
			.union([choiceStringPredicate.array().max(25), choiceNumberPredicate.array().max(25)])
			.optional(),
	})
	.refine(
		(data) => {
			// Validate autocomplete and choices are mutually exclusive
			if (data.autocomplete === true && data.choices && data.choices.length > 0) {
				return false;
			}
			return true;
		},
		{ message: 'Autocomplete and choices are mutually exclusive' },
	)
	.refine(
		(data) => {
			// Validate integer min/max are integers
			if (data.type === ApplicationCommandOptionType.Integer) {
				if (data.max_value !== undefined && !Number.isInteger(data.max_value)) return false;
				if (data.min_value !== undefined && !Number.isInteger(data.min_value)) return false;
			}
			return true;
		},
		{ message: 'Integer options must have integer min/max values' },
	);

const baseChatInputCommandPredicate = sharedNameAndDescriptionPredicate.extend({
	contexts: z.array(z.enum(InteractionContextType)).optional(),
	default_member_permissions: memberPermissionsPredicate.optional(),
	integration_types: z.array(z.enum(ApplicationIntegrationType)).optional(),
	nsfw: z.boolean().optional(),
});

// Full predicate for subcommand (used for nested validation in subcommand groups)
const fullSubcommandPredicate = sharedNameAndDescriptionPredicate.extend({
	type: z.literal(ApplicationCommandOptionType.Subcommand),
	options: z.array(fullBasicOptionPredicate).max(25).optional(),
});

// Full predicate for subcommand group (used for nested validation in chat input commands)
const fullSubcommandGroupPredicate = sharedNameAndDescriptionPredicate.extend({
	type: z.literal(ApplicationCommandOptionType.SubcommandGroup),
	options: z.array(fullSubcommandPredicate).min(1).max(25),
});

// Full options predicate for chat input commands (validates complete nested structure)
const fullChatInputCommandOptionsPredicate = z.union([
	z.array(fullBasicOptionPredicate),
	z.array(fullSubcommandPredicate),
	z.array(fullSubcommandGroupPredicate),
]);

export const chatInputCommandPredicate = baseChatInputCommandPredicate.extend({
	options: fullChatInputCommandOptionsPredicate.optional(),
});

export const chatInputCommandSubcommandGroupPredicate = sharedNameAndDescriptionPredicate.extend({
	type: z.literal(ApplicationCommandOptionType.SubcommandGroup),
	options: z.array(fullSubcommandPredicate).min(1).max(25),
});

export const chatInputCommandSubcommandPredicate = sharedNameAndDescriptionPredicate.extend({
	type: z.literal(ApplicationCommandOptionType.Subcommand),
	options: z.array(fullBasicOptionPredicate).max(25).optional(),
});
