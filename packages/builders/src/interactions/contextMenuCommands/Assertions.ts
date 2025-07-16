import { s } from '@sapphire/shapeshift';
import { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';
import { isValidationEnabled } from '../../util/validation.js';
import type { ContextMenuCommandType } from './ContextMenuCommandBuilder.js';

const namePredicate = s
	.string()
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(32)
	.regex(/\S/)
	.setValidationEnabled(isValidationEnabled);
const typePredicate = s
	.union([s.literal(ApplicationCommandType.User), s.literal(ApplicationCommandType.Message)])
	.setValidationEnabled(isValidationEnabled);
const booleanPredicate = s.boolean();

export function validateDefaultPermission(value: unknown): asserts value is boolean {
	booleanPredicate.parse(value);
}

export function validateName(name: unknown): asserts name is string {
	namePredicate.parse(name);
}

export function validateType(type: unknown): asserts type is ContextMenuCommandType {
	typePredicate.parse(type);
}

export function validateRequiredParameters(name: string, type: number) {
	// Assert name matches all conditions
	validateName(name);

	// Assert type is valid
	validateType(type);
}

const dmPermissionPredicate = s.boolean().nullish();

export function validateDMPermission(value: unknown): asserts value is boolean | null | undefined {
	dmPermissionPredicate.parse(value);
}

const memberPermissionPredicate = s
	.union([
		s.bigint().transform((value) => value.toString()),
		s
			.number()
			.safeInt()
			.transform((value) => value.toString()),
		s.string().regex(/^\d+$/),
	])
	.nullish();

export function validateDefaultMemberPermissions(permissions: unknown) {
	return memberPermissionPredicate.parse(permissions);
}

export const contextsPredicate = s.array(
	s.nativeEnum(InteractionContextType).setValidationEnabled(isValidationEnabled),
);

export const integrationTypesPredicate = s.array(
	s.nativeEnum(ApplicationIntegrationType).setValidationEnabled(isValidationEnabled),
);
