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

export interface RecursiveReadonlyArray<ItemType> extends ReadonlyArray<ItemType | RecursiveReadonlyArray<ItemType>> {}

export type EnumLike<Enum, Value> = Record<keyof Enum, Value>;

export type If<Check, Value, True, False = never> = Check extends Value ? (Value extends Check ? True : False) : False;

export type NonAbstract<Type extends abstract new (...args: any) => any> = Type extends abstract new (
	...args: infer Args
) => infer Instance
	? Pick<Type, keyof Type> & (new (...args: Args) => Instance)
	: never;

export type Partialize<Type, Omitted extends keyof Type | ''> = Omit<Type, Omitted> &
	Partial<Pick<Type, Exclude<Omitted, ''>>>;
