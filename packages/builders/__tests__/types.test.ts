import { expectTypeOf } from 'vitest';
import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from '../src/index.js';

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
