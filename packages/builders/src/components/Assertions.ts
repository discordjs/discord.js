import { s } from '@sapphire/shapeshift';
import { ButtonStyle, ChannelType, type APIMessageComponentEmoji } from 'discord-api-types/v10';
import { isValidationEnabled } from '../util/validation.js';
import { StringSelectMenuOptionBuilder } from './selectMenu/StringSelectMenuOption.js';

export const idValidator = s
	.number()
	.safeInt()
	.greaterThanOrEqual(1)
	.lessThan(4_294_967_296) // 2^32 - 1
	.setValidationEnabled(isValidationEnabled);

export const customIdValidator = s
	.string()
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(100)
	.setValidationEnabled(isValidationEnabled);

export const emojiValidator = s
	.object({
		id: s.string(),
		name: s.string(),
		animated: s.boolean(),
	})
	.partial()
	.strict()
	.setValidationEnabled(isValidationEnabled);

export const disabledValidator = s.boolean();

export const buttonLabelValidator = s
	.string()
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(80)
	.setValidationEnabled(isValidationEnabled);

export const buttonStyleValidator = s.nativeEnum(ButtonStyle);

export const placeholderValidator = s.string().lengthLessThanOrEqual(150).setValidationEnabled(isValidationEnabled);
export const minMaxValidator = s
	.number()
	.int()
	.greaterThanOrEqual(0)
	.lessThanOrEqual(25)
	.setValidationEnabled(isValidationEnabled);

export const labelValueDescriptionValidator = s
	.string()
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(100)
	.setValidationEnabled(isValidationEnabled);

export const jsonOptionValidator = s
	.object({
		label: labelValueDescriptionValidator,
		value: labelValueDescriptionValidator,
		description: labelValueDescriptionValidator.optional(),
		emoji: emojiValidator.optional(),
		default: s.boolean().optional(),
	})
	.setValidationEnabled(isValidationEnabled);

export const optionValidator = s.instance(StringSelectMenuOptionBuilder).setValidationEnabled(isValidationEnabled);

export const optionsValidator = optionValidator
	.array()
	.lengthGreaterThanOrEqual(0)
	.setValidationEnabled(isValidationEnabled);
export const optionsLengthValidator = s
	.number()
	.int()
	.greaterThanOrEqual(0)
	.lessThanOrEqual(25)
	.setValidationEnabled(isValidationEnabled);

export function validateRequiredSelectMenuParameters(options: StringSelectMenuOptionBuilder[], customId?: string) {
	customIdValidator.parse(customId);
	optionsValidator.parse(options);
}

export const defaultValidator = s.boolean();

export function validateRequiredSelectMenuOptionParameters(label?: string, value?: string) {
	labelValueDescriptionValidator.parse(label);
	labelValueDescriptionValidator.parse(value);
}

export const channelTypesValidator = s.nativeEnum(ChannelType).array().setValidationEnabled(isValidationEnabled);

export const urlValidator = s
	.string()
	.url({
		allowedProtocols: ['http:', 'https:', 'discord:'],
	})
	.setValidationEnabled(isValidationEnabled);

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
