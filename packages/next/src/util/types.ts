import type { Structure } from '@discordjs/structures';
import type { Awaitable } from '@discordjs/util';

export interface Cache<Key, Type extends Structure<object>> {
	get(key: Key): Awaitable<Type | undefined>;
	set(key: Key, value: Type): Awaitable<this>;
}

export type CacheConstructor = new (...args: any[]) => Cache<unknown, Structure<object>>;
