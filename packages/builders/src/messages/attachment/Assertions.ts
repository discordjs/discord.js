import { s } from '@sapphire/shapeshift';

export const nameValidator = s.string;

export const descriptionValidator = s.string;

export const spoilerValidator = s.boolean;

export function validateRequiredAttachmentParameters(
	name: string | null | undefined,
	description: string | null | undefined,
) {
	nameValidator.parse(name);
	descriptionValidator.parse(description);
}
