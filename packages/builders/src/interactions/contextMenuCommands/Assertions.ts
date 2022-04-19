import { s } from '@sapphire/shapeshift';
import { ApplicationCommandType } from 'discord-api-types/v10';
import type { ContextMenuCommandType } from './ContextMenuCommandBuilder';

const namePredicate = s.string
	.lengthGe(1)
	.lengthLe(32)
	.regex(/^( *[\p{L}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+ *)+$/u);

const typePredicate = s.union(s.literal(ApplicationCommandType.User), s.literal(ApplicationCommandType.Message));

const booleanPredicate = s.boolean;

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
