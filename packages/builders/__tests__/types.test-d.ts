import type { ApplicationCommandOptionAllowedChannelType } from 'discord-api-types/v10';
import { expectTypeOf } from 'vitest';
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

expectTypeOf(getBuilder().addStringOptions(getStringOption())).toMatchTypeOf<BuilderPropsOnly>();

expectTypeOf(getBuilder().addSubcommands(getSubcommand())).toMatchTypeOf<BuilderPropsOnly>();

export type CheckExhaustiveAllowedChannelTypes = AssertNever<
	Exclude<ApplicationCommandOptionAllowedChannelType, (typeof ApplicationCommandOptionAllowedChannelTypes)[number]>
>;
