import { s } from '@sapphire/shapeshift';
import { ActionRowBuilder, type ModalActionRowComponentBuilder } from '../..';
import { customIdValidator } from '../../components/Assertions';

export const titleValidator = s.string.lengthGe(1).lengthLe(45);
export const componentsValidator = s.array(s.instance(ActionRowBuilder)).lengthGe(1);

export function validateRequiredParameters(
	customId?: string,
	title?: string,
	components?: ActionRowBuilder<ModalActionRowComponentBuilder>[],
) {
	customIdValidator.parse(customId);
	titleValidator.parse(title);
	componentsValidator.parse(components);
}
