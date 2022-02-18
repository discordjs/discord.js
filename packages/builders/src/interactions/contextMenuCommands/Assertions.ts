import { z } from 'zod';
import { ApplicationCommandType } from 'discord-api-types/v10';
import type { ContextMenuCommandType } from './ContextMenuCommandBuilder';

const namePredicate = z
	.string()
	.min(1)
	.max(32)
	.regex(/^( *[\p{L}\p{N}_-]+ *)+$/u);

const typePredicate = z.union([z.literal(ApplicationCommandType.User), z.literal(ApplicationCommandType.Message)]);

const booleanPredicate = z.boolean();

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
