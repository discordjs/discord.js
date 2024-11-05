import { expectTypeOf } from 'vitest';
import {
	ChatInputCommandBuilder,
	ChatInputCommandStringOption,
	ChatInputCommandSubcommandBuilder,
} from '../src/index.js';

const getBuilder = () => new ChatInputCommandBuilder();
const getStringOption = () => new ChatInputCommandStringOption().setName('owo').setDescription('Testing 123');
const getSubcommand = () => new ChatInputCommandSubcommandBuilder().setName('owo').setDescription('Testing 123');

type BuilderPropsOnly<Type = ChatInputCommandBuilder> = Pick<
	Type,
	keyof {
		[Key in keyof Type as Type[Key] extends (...args: any) => any ? never : Key]: any;
	}
>;

expectTypeOf(getBuilder().addStringOption(getStringOption())).toMatchTypeOf<BuilderPropsOnly>();

expectTypeOf(getBuilder().addSubcommand(getSubcommand())).toMatchTypeOf<BuilderPropsOnly>();
