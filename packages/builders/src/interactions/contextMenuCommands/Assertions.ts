import { ApplicationCommandType } from 'discord-api-types/v10';
import { z } from 'zod';
import type { ContextMenuCommandType } from './ContextMenuCommandBuilder.js';

const namePredicate = z
	.string()
	.min(1)
	.max(32)
	// eslint-disable-next-line prefer-named-capture-group
	.regex(/^( *[\p{P}\p{L}\p{N}\p{sc=Devanagari}\p{sc=Thai}]+ *)+$/u);
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

const dmPermissionPredicate = z.boolean().nullish();

export function validateDMPermission(value: unknown): asserts value is boolean | null | undefined {
	dmPermissionPredicate.parse(value);
}

const memberPermissionPredicate = z
	.union([
		z.bigint().transform((value) => value.toString()),
		z
			.number()
			.int()
			.safe()
			.transform((value) => value.toString()),
		z.string().regex(/^\d+$/),
	])
	.nullish();

export function validateDefaultMemberPermissions(permissions: unknown) {
	return memberPermissionPredicate.parse(permissions);
}
