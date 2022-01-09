import is from '@sindresorhus/is';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v9';
import { z } from 'zod';
import type { ApplicationCommandOptionBase } from './mixins/ApplicationCommandOptionBase';
import type { ToAPIApplicationCommandOptions } from './SlashCommandBuilder';
import type { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from './SlashCommandSubcommands';

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

const namePredicate = z
	.string()
	.min(1)
	.max(32)
	.regex(/^[\P{Lu}\p{N}_-]+$/u);

export function validateName(name: unknown): asserts name is string {
	namePredicate.parse(name);
}

const descriptionPredicate = z.string().min(1).max(100);

export function validateDescription(description: unknown): asserts description is string {
	descriptionPredicate.parse(description);
}

const booleanPredicate = z.boolean();

export function validateDefaultPermission(value: unknown): asserts value is boolean {
	booleanPredicate.parse(value);
}

export function validateRequired(required: unknown): asserts required is boolean {
	booleanPredicate.parse(required);
}

const maxArrayLengthPredicate = z.unknown().array().max(25);

export function validateMaxOptionsLength(options: unknown): asserts options is ToAPIApplicationCommandOptions[] {
	maxArrayLengthPredicate.parse(options);
}

export function validateMaxChoicesLength(choices: APIApplicationCommandOptionChoice[]) {
	maxArrayLengthPredicate.parse(choices);
}

export function assertReturnOfBuilder<
	T extends ApplicationCommandOptionBase | SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder,
>(input: unknown, ExpectedInstanceOf: new () => T): asserts input is T {
	const instanceName = ExpectedInstanceOf.name;

	if (is.nullOrUndefined(input)) {
		throw new TypeError(
			`Expected to receive a ${instanceName} builder, got ${input === null ? 'null' : 'undefined'} instead.`,
		);
	}

	if (is.primitive(input)) {
		throw new TypeError(`Expected to receive a ${instanceName} builder, got a primitive (${typeof input}) instead.`);
	}

	if (!(input instanceof ExpectedInstanceOf)) {
		const casted = input as Record<PropertyKey, unknown>;

		const constructorName = is.function_(input) ? input.name : casted.constructor.name;
		const stringTag = Reflect.get(casted, Symbol.toStringTag) as string | undefined;

		const fullResultName = stringTag ? `${constructorName} [${stringTag}]` : constructorName;

		throw new TypeError(`Expected to receive a ${instanceName} builder, got ${fullResultName} instead.`);
	}
}
