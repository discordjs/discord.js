import { APIMessageComponentEmoji, ButtonStyle } from 'discord-api-types/v9';
import { s } from '@sapphire/shapeshift';
import type { SelectMenuOption } from './selectMenu/SelectMenuOption';

export const customIdValidator = s.string.lengthGe(1).lengthLte(100);

export const emojiValidator = s.object({
	id: s.string,
	name: s.string,
	animated: s.boolean,
}).partial.strict;

export const disabledValidator = s.boolean;

export const buttonLabelValidator = s.string.lengthGe(1).lengthLe(80);

export const buttonStyleValidator = s.enum(ButtonStyle);
// TODO: after v2
// .nativeEnum(ButtonStyle);

export const placeholderValidator = s.string.lengthLe(100);
export const minMaxValidator = s.number.int.ge(0).le(25);

export const optionsValidator = s.object({}).array;
// TODO: after v2
// .lengthGe(1);

export function validateRequiredSelectMenuParameters(options: SelectMenuOption[], customId?: string) {
	customIdValidator.parse(customId);
	optionsValidator.parse(options);
}

export const labelValueValidator = s.string.lengthGe(1).lengthLte(100);
export const defaultValidator = s.boolean;

export function validateRequiredSelectMenuOptionParameters(label?: string, value?: string) {
	labelValueValidator.parse(label);
	labelValueValidator.parse(value);
}

export const urlValidator = s.string;
// TODO: after v2
// .url();

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
