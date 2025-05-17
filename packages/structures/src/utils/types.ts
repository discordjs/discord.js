import type { APIThreadChannel as _APIThreadChannel } from 'discord-api-types/v10';

export type ReplaceOmittedWithUnknown<Omitted extends keyof Data | '', Data> = {
	[Key in keyof Data]: Key extends Omitted ? unknown : Data[Key];
};

export type CollapseUnion<Type> = Type extends infer Union ? { [Key in keyof Union]: Union[Key] } : never;

export type OptionalPropertyNames<Type> = {
	[Key in keyof Type]-?: {} extends { [Prop in Key]: Type[Key] } ? Key : never;
}[keyof Type];

export type MergePrototype<Class1, Class2> = Pick<Class1, Exclude<keyof Class1, keyof Class2>> &
	Pick<Class2, Exclude<keyof Class2, OptionalPropertyNames<Class2>>> &
	Pick<Class2, Exclude<OptionalPropertyNames<Class2>, keyof Class1>> & {
		[Prop in OptionalPropertyNames<Class2> & keyof Class1]: Class1[Prop] | Exclude<Class2[Prop], undefined>;
	};

export type MergePrototypes<ClassArray extends readonly unknown[]> = ClassArray extends [infer Class1]
	? Class1
	: ClassArray extends [infer Class1, ...infer Rest]
		? MergePrototype<Class1, MergePrototypes<Rest>>
		: never;

// TODO: remove helper type once dtypes PR for thread channel types releases
export type APIThreadChannel = Omit<_APIThreadChannel, 'position'>;
