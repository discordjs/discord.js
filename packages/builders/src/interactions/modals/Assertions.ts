import { z } from 'zod';
import { ActionRow, type ModalActionRowComponent } from '../..';
import { customIdValidator } from '../../components/Assertions';

export const titleValidator = z.string().min(1).max(45);
export const componentsValidator = z.array(z.instanceof(ActionRow)).min(1);

export function validateRequiredParameters(
	customId?: string,
	title?: string,
	components?: ActionRow<ModalActionRowComponent>[],
) {
	customIdValidator.parse(customId);
	titleValidator.parse(title);
	componentsValidator.parse(components);
}
