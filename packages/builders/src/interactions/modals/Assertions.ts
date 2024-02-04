import { z } from 'zod';
import { ActionRowBuilder, type ModalActionRowComponentBuilder } from '../../components/ActionRow.js';
import { customIdValidator } from '../../components/Assertions.js';
import { parse } from '../../util/validation.js';

export const titleValidator = z.string().min(1).max(45);
export const componentsValidator = z.instanceof(ActionRowBuilder).array().min(1);

export function validateRequiredParameters(
	customId?: string,
	title?: string,
	components?: ActionRowBuilder<ModalActionRowComponentBuilder>[],
) {
	parse(customIdValidator, customId);
	parse(titleValidator, title);
	parse(componentsValidator, components);
}
