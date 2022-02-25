import { z } from 'zod';
import { ActionRow, type ModalActionRowComponent } from '../..';

export const titleValidator = z.string();
export const componentsValidator = z.array(z.instanceof(ActionRow)).min(1);

export function validateRequiredParameters(
	customId?: string,
	title?: string,
	components?: ActionRow<ModalActionRowComponent>[],
) {
	if (!customId || !title || !components || components.length === 0) {
		throw new TypeError('Modals are required to have a customId, title and at least one component.');
	}
}
