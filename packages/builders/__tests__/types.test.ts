import type { ApplicationCommandOptionAllowedChannelType } from 'discord-api-types/v10';
import { expectTypeOf } from 'vitest';
import {
	type ApplicationCommandOptionAllowedChannelTypes,
	SlashCommandBuilder,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
} from '../src/index.js';

type AssertNever<Type extends never> = Type;

const getBuilder = () => new SlashCommandBuilder();
const getStringOption = () => new SlashCommandStringOption().setName('owo').setDescription('Testing 123');
const getSubcommand = () => new SlashCommandSubcommandBuilder().setName('owo').setDescription('Testing 123');

type BuilderPropsOnly<Type = SlashCommandBuilder> = Pick<
	Type,
	keyof {
		[Key in keyof Type as Type[Key] extends (...args: any) => any ? never : Key]: any;
	}
>;

expectTypeOf(getBuilder().addStringOption(getStringOption())).toMatchTypeOf<BuilderPropsOnly>();

expectTypeOf(getBuilder().addSubcommand(getSubcommand())).toMatchTypeOf<BuilderPropsOnly>();

export type CheckExhaustiveAllowedChannelTypes = AssertNever<
	Exclude<ApplicationCommandOptionAllowedChannelType, ApplicationCommandOptionAllowedChannelTypes>
>;
