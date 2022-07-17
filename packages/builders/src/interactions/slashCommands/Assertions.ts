import { s } from '@sapphire/shapeshift';
import { type APIApplicationCommandOptionChoice, Locale, LocalizationMap } from 'discord-api-types/v10';
import type { ToAPIApplicationCommandOptions } from './SlashCommandBuilder';
import type { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from './SlashCommandSubcommands';
import type { ApplicationCommandOptionBase } from './mixins/ApplicationCommandOptionBase';
import { isValidationEnabled } from '../../util/validation';

const namePredicate = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(32)
	.regex(/^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u)
	.setValidationEnabled(isValidationEnabled);

export function validateName(name: unknown): asserts name is string {
	namePredicate.parse(name);
}

const descriptionPredicate = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(100)
	.setValidationEnabled(isValidationEnabled);
const localePredicate = s.nativeEnum(Locale);

export function validateDescription(description: unknown): asserts description is string {
	descriptionPredicate.parse(description);
}

const maxArrayLengthPredicate = s.unknown.array.lengthLessThanOrEqual(25).setValidationEnabled(isValidationEnabled);
export function validateLocale(locale: unknown) {
	return localePredicate.parse(locale);
}

export function validateMaxOptionsLength(options: unknown): asserts options is ToAPIApplicationCommandOptions[] {
	maxArrayLengthPredicate.parse(options);
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

const booleanPredicate = s.boolean;

export function validateDefaultPermission(value: unknown): asserts value is boolean {
	booleanPredicate.parse(value);
}

export function validateRequired(required: unknown): asserts required is boolean {
	booleanPredicate.parse(required);
}

const choicesLengthPredicate = s.number.lessThanOrEqual(25).setValidationEnabled(isValidationEnabled);

export function validateChoicesLength(amountAdding: number, choices?: APIApplicationCommandOptionChoice[]): void {
	choicesLengthPredicate.parse((choices?.length ?? 0) + amountAdding);
}

export function assertReturnOfBuilder<
	T extends ApplicationCommandOptionBase | SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder,
>(input: unknown, ExpectedInstanceOf: new () => T): asserts input is T {
	s.instance(ExpectedInstanceOf).parse(input);
}

export const localizationMapPredicate = s
	.object<LocalizationMap>(Object.fromEntries(Object.values(Locale).map((locale) => [locale, s.string.nullish])))
	.strict.nullish.setValidationEnabled(isValidationEnabled);

export function validateLocalizationMap(value: unknown): asserts value is LocalizationMap {
	localizationMapPredicate.parse(value);
}

const dmPermissionPredicate = s.boolean.nullish;

export function validateDMPermission(value: unknown): asserts value is boolean | null | undefined {
	dmPermissionPredicate.parse(value);
}

const memberPermissionPredicate = s.union(
	s.bigint.transform((value) => value.toString()),
	s.number.safeInt.transform((value) => value.toString()),
	s.string.regex(/^\d+$/),
).nullish;

export function validateDefaultMemberPermissions(permissions: unknown) {
	return memberPermissionPredicate.parse(permissions);
}
