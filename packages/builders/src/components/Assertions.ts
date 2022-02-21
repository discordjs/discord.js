import { APIMessageComponentEmoji, ButtonStyle } from 'discord-api-types/v9';
import { z } from 'zod';
import type { SelectMenuOption } from './selectMenu/SelectMenuOption';

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

export const buttonLabelValidator = z.string().nonempty().max(80);

export const buttonStyleValidator = z.number().int().min(ButtonStyle.Primary).max(ButtonStyle.Link);

export const placeholderValidator = z.string().max(100);
export const minMaxValidator = z.number().int().min(0).max(25);

export const optionsValidator = z.object({}).array().nonempty();

export function validateRequiredSelectMenuParameters(options: SelectMenuOption[], customId?: string) {
	customIdValidator.parse(customId);
	optionsValidator.parse(options);
}

export const labelValueValidator = z.string().min(1).max(100);
export const defaultValidator = z.boolean();

export function validateRequiredSelectMenuOptionParameters(label?: string, value?: string) {
	labelValueValidator.parse(label);
	labelValueValidator.parse(value);
}

export const urlValidator = z.string().url();

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
