import { z } from 'zod';
import { ActionRowBuilder, type ModalActionRowComponentBuilder } from '../..';
import { customIdValidator } from '../../components/Assertions';

export const titleValidator = z.string().min(1).max(45);
export const componentsValidator = z.array(z.instanceof(ActionRowBuilder)).min(1);

export function validateRequiredParameters(
	customId?: string,
	title?: string,
	components?: ActionRowBuilder<ModalActionRowComponentBuilder>[],
) {
	customIdValidator.parse(customId);
	titleValidator.parse(title);
	componentsValidator.parse(components);
}
