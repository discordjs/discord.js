import { s } from '@sapphire/shapeshift';
import { APIMessageComponentEmoji, ButtonStyle } from 'discord-api-types/v10';
import type { SelectMenuOptionBuilder } from './selectMenu/SelectMenuOption';
import { UnsafeSelectMenuOptionBuilder } from './selectMenu/UnsafeSelectMenuOption';

export const customIdValidator = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100);

export const emojiValidator = s.object({
	id: s.string,
	name: s.string,
	animated: s.boolean,
}).partial.strict;

export const disabledValidator = s.boolean;

export const buttonLabelValidator = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(80);

export const buttonStyleValidator = s.nativeEnum(ButtonStyle);

export const placeholderValidator = s.string.lengthLessThanOrEqual(150);
export const minMaxValidator = s.number.int.greaterThanOrEqual(0).lessThanOrEqual(25);

export const labelValueDescriptionValidator = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100);
export const optionValidator = s.union(
	s.object({
		label: labelValueDescriptionValidator,
		value: labelValueDescriptionValidator,
		description: labelValueDescriptionValidator.optional,
		emoji: emojiValidator.optional,
		default: s.boolean.optional,
	}),
	s.instance(UnsafeSelectMenuOptionBuilder),
);
export const optionsValidator = optionValidator.array.lengthGreaterThanOrEqual(0);
export const optionsLengthValidator = s.number.int.greaterThanOrEqual(0).lessThanOrEqual(25);

export function validateRequiredSelectMenuParameters(options: SelectMenuOptionBuilder[], customId?: string) {
	customIdValidator.parse(customId);
	optionsValidator.parse(options);
}

export const labelValueValidator = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100);
export const defaultValidator = s.boolean;

export function validateRequiredSelectMenuOptionParameters(label?: string, value?: string) {
	labelValueValidator.parse(label);
	labelValueValidator.parse(value);
}

export const urlValidator = s.string.url({
	allowedProtocols: ['http:', 'https:', 'discord:'],
});

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
