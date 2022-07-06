import { s } from '@sapphire/shapeshift';
import { ActionRowBuilder, type ModalActionRowComponentBuilder } from '../../components/ActionRow';
import { customIdValidator } from '../../components/Assertions';
import { isValidationEnabled } from '../../util/validation';

export const titleValidator = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(45)
	.setValidationEnabled(isValidationEnabled);
export const componentsValidator = s
	.instance(ActionRowBuilder)
	.array.lengthGreaterThanOrEqual(1)
	.setValidationEnabled(isValidationEnabled);

export function validateRequiredParameters(
	customId?: string,
	title?: string,
	components?: ActionRowBuilder<ModalActionRowComponentBuilder>[],
) {
	customIdValidator.parse(customId);
	titleValidator.parse(title);
	componentsValidator.parse(components);
}
