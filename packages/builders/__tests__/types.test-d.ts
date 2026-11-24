import type { ApplicationCommandOptionAllowedChannelType } from 'discord-api-types/v10';
import { expectTypeOf, test } from 'vitest';
import {
	type ApplicationCommandOptionAllowedChannelTypes,
	ChatInputCommandBuilder,
	ChatInputCommandStringOption,
	ChatInputCommandSubcommandBuilder,
} from '../src/index.js';

type AssertNever<Type extends never> = Type;

const getBuilder = () => new ChatInputCommandBuilder();
const getStringOption = () => new ChatInputCommandStringOption().setName('owo').setDescription('Testing 123');
const getSubcommand = () => new ChatInputCommandSubcommandBuilder().setName('owo').setDescription('Testing 123');

type BuilderPropsOnly<Type = ChatInputCommandBuilder> = Pick<
	Type,
	keyof {
		[Key in keyof Type as Type[Key] extends (...args: any) => any ? never : Key]: any;
	}
>;

test('ChatInputCommandBuilder option adders return the builder', () => {
	expectTypeOf(getBuilder().addStringOptions(getStringOption())).toExtend<BuilderPropsOnly>();

	expectTypeOf(getBuilder().addSubcommands(getSubcommand())).toExtend<BuilderPropsOnly>();
});

export type CheckExhaustiveAllowedChannelTypes = AssertNever<
	Exclude<ApplicationCommandOptionAllowedChannelType, (typeof ApplicationCommandOptionAllowedChannelTypes)[number]>
>;
