import { ButtonStyle, ChannelType, type APIMessageComponentEmoji } from 'discord-api-types/v10';
import { z } from 'zod';
import { parse } from '../util/validation.js';
import { StringSelectMenuOptionBuilder } from './selectMenu/StringSelectMenuOption.js';

export const customIdValidator = z.string().min(1).max(100);

export const emojiValidator = z
	.object({
		id: z.string(),
		name: z.string(),
		animated: z.boolean(),
	})
	.partial()
	.strict();

export const disabledValidator = z.boolean();

export const buttonLabelValidator = z.string().min(1).max(80);

export const buttonStyleValidator = z.union([
	z.nativeEnum(ButtonStyle),
	z
		.enum(
			Object.values(ButtonStyle).filter((value) => typeof value === 'string') as [
				keyof typeof ButtonStyle,
				...(keyof typeof ButtonStyle)[],
			],
		)
		.transform((key) => ButtonStyle[key]),
]);

export const placeholderValidator = z.string().max(150);
export const minMaxValidator = z.number().int().gte(0).lte(25);

export const labelValueDescriptionValidator = z.string().min(1).max(100);

export const jsonOptionValidator = z.object({
	label: labelValueDescriptionValidator,
	value: labelValueDescriptionValidator,
	description: labelValueDescriptionValidator.optional(),
	emoji: emojiValidator.optional(),
	default: z.boolean().optional(),
});

export const optionValidator = z.instanceof(StringSelectMenuOptionBuilder);

export const optionsValidator = optionValidator.array().min(0);
export const optionsLengthValidator = z.number().int().gte(0).lte(25);

export function validateRequiredSelectMenuParameters(options: StringSelectMenuOptionBuilder[], customId?: string) {
	parse(customIdValidator, customId);
	parse(optionsValidator, options);
}

export const defaultValidator = z.boolean();

export function validateRequiredSelectMenuOptionParameters(label?: string, value?: string) {
	parse(labelValueDescriptionValidator, label);
	parse(labelValueDescriptionValidator, value);
}

export const channelTypesValidator = z
	.union([
		z.nativeEnum(ChannelType),
		z
			.enum(
				Object.values(ChannelType).filter((value) => typeof value === 'string') as [
					keyof typeof ChannelType,
					...(keyof typeof ChannelType)[],
				],
			)
			.transform((key) => ChannelType[key]),
	])
	.array();

export const urlValidator = z
	.string()
	.url()
	.regex(/^(?<proto>https?|discord):\/\//);

export function validateRequiredButtonParameters(
	style?: ButtonStyle,
	label?: string,
	emoji?: APIMessageComponentEmoji,
	customId?: string,
	skuId?: string,
	url?: string,
) {
	if (style === ButtonStyle.Premium) {
		if (!skuId) {
			throw new RangeError('Premium buttons must have an SKU id.');
		}

		if (customId || label || url || emoji) {
			throw new RangeError('Premium buttons cannot have a custom id, label, URL, or emoji.');
		}
	} else {
		if (skuId) {
			throw new RangeError('Non-premium buttons must not have an SKU id.');
		}

		if (url && customId) {
			throw new RangeError('URL and custom id are mutually exclusive.');
		}

		if (!label && !emoji) {
			throw new RangeError('Non-premium buttons must have a label and/or an emoji.');
		}

		if (style === ButtonStyle.Link) {
			if (!url) {
				throw new RangeError('Link buttons must have a URL.');
			}
		} else if (url) {
			throw new RangeError('Non-premium and non-link buttons cannot have a URL.');
		}
	}
}
