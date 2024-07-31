import {
	ApplicationIntegrationType,
	InteractionContextType,
	Locale,
	type APIApplicationCommandOptionChoice,
	type LocalizationMap,
} from 'discord-api-types/v10';
import { z } from 'zod';
import { parse } from '../../util/validation.js';
import type { ToAPIApplicationCommandOptions } from './SlashCommandBuilder.js';
import type { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from './SlashCommandSubcommands.js';
import type { ApplicationCommandOptionBase } from './mixins/ApplicationCommandOptionBase.js';

const namePredicate = z
	.string()
	.min(1)
	.max(32)
	.regex(/^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u);

export function validateName(name: unknown): asserts name is string {
	parse(namePredicate, name);
}

const descriptionPredicate = z.string().min(1).max(100);
const localePredicate = z.nativeEnum(Locale);

export function validateDescription(description: unknown): asserts description is string {
	parse(descriptionPredicate, description);
}

const maxArrayLengthPredicate = z.unknown().array().max(25);
export function validateLocale(locale: unknown) {
	return parse(localePredicate, locale);
}

export function validateMaxOptionsLength(options: unknown): asserts options is ToAPIApplicationCommandOptions[] {
	parse(maxArrayLengthPredicate, options);
}

export function validateRequiredParameters(
	name: string,
	description: string,
	options: ToAPIApplicationCommandOptions[],
) {
	// Assert name matches all conditions
	validateName(name);

	// Assert description conditions
	validateDescription(description);

	// Assert options conditions
	validateMaxOptionsLength(options);
}

const booleanPredicate = z.boolean();

export function validateDefaultPermission(value: unknown): asserts value is boolean {
	parse(booleanPredicate, value);
}

export function validateRequired(required: unknown): asserts required is boolean {
	parse(booleanPredicate, required);
}

const choicesLengthPredicate = z.number().max(25);

export function validateChoicesLength(amountAdding: number, choices?: APIApplicationCommandOptionChoice[]): void {
	parse(choicesLengthPredicate, (choices?.length ?? 0) + amountAdding);
}

export function assertReturnOfBuilder<
	ReturnType extends ApplicationCommandOptionBase | SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder,
>(input: unknown, ExpectedInstanceOf: new () => ReturnType): asserts input is ReturnType {
	parse(z.instanceof(ExpectedInstanceOf), input);
}

export const localizationMapPredicate = z.record(z.nativeEnum(Locale), z.string().nullish()).nullish();

export function validateLocalizationMap(value: unknown): asserts value is LocalizationMap {
	parse(localizationMapPredicate, value);
}

const dmPermissionPredicate = z.boolean().nullish();

export function validateDMPermission(value: unknown): asserts value is boolean | null | undefined {
	parse(dmPermissionPredicate, value);
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
	return parse(memberPermissionPredicate, permissions);
}

export function validateNSFW(value: unknown): asserts value is boolean {
	parse(booleanPredicate, value);
}

export const contextsPredicate = z.nativeEnum(InteractionContextType).array();

export const integrationTypesPredicate = z.nativeEnum(ApplicationIntegrationType).array();
