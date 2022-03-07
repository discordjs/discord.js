import { s } from '@sapphire/shapeshift';
import { ActionRow, type ModalActionRowComponent } from '../..';
import { customIdValidator } from '../../components/Assertions';

export const titleValidator = s.string.lengthGe(1).lengthLe(45);
export const componentsValidator = s.array(s.instance(ActionRow));
// TODO: after v2
// .lengthGe(1);

export function validateRequiredParameters(
	customId?: string,
	title?: string,
	components?: ActionRow<ModalActionRowComponent>[],
) {
	customIdValidator.parse(customId);
	titleValidator.parse(title);
	componentsValidator.parse(components);
}
