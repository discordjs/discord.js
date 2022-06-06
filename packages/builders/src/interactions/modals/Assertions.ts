import { s } from '@sapphire/shapeshift';
import { ActionRowBuilder, type ModalActionRowComponentBuilder } from '../..';
import { customIdValidator } from '../../components/Assertions';

export const titleValidator = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(45);
export const componentsValidator = s.instance(ActionRowBuilder).array.lengthGreaterThanOrEqual(1);

export function validateRequiredParameters(
	customId?: string,
	title?: string,
	components?: ActionRowBuilder<ModalActionRowComponentBuilder>[],
) {
	customIdValidator.parse(customId);
	titleValidator.parse(title);
	componentsValidator.parse(components);
}
