import { s } from '@sapphire/shapeshift';
import { ActionRowBuilder, type ModalActionRowComponentBuilder } from '../../components/ActionRow.js';
import { customIdValidator } from '../../components/Assertions.js';
import { LabelBuilder } from '../../components/label/Label.js';
import { TextDisplayBuilder } from '../../components/v2/TextDisplay.js';
import { isValidationEnabled } from '../../util/validation.js';

export const titleValidator = s
	.string()
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(45)
	.setValidationEnabled(isValidationEnabled);
export const componentsValidator = s
	.union([s.instance(ActionRowBuilder), s.instance(LabelBuilder), s.instance(TextDisplayBuilder)])
	.array()
	.lengthGreaterThanOrEqual(1)
	.setValidationEnabled(isValidationEnabled);

export function validateRequiredParameters(
	customId?: string,
	title?: string,
	components?: (ActionRowBuilder<ModalActionRowComponentBuilder> | LabelBuilder | TextDisplayBuilder)[],
) {
	customIdValidator.parse(customId);
	titleValidator.parse(title);
	componentsValidator.parse(components);
}
