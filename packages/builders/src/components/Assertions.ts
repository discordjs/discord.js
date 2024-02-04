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

export const buttonStyleValidator = z.nativeEnum(ButtonStyle);

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

export const channelTypesValidator = z.nativeEnum(ChannelType).array();

export const urlValidator = z
	.string()
	.url()
	.regex(/^(?<proto>https?|discord):\/\//);

export function validateRequiredButtonParameters(
	style?: ButtonStyle,
	label?: string,
	emoji?: APIMessageComponentEmoji,
	customId?: string,
	url?: string,
) {
	if (url && customId) {
		throw new RangeError('URL and custom id are mutually exclusive');
	}

	if (!label && !emoji) {
		throw new RangeError('Buttons must have a label and/or an emoji');
	}

	if (style === ButtonStyle.Link) {
		if (!url) {
			throw new RangeError('Link buttons must have a url');
		}
	} else if (url) {
		throw new RangeError('Non-link buttons cannot have a url');
	}
}
