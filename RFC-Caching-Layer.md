<!-- RFC: Async Caching Layer & Modernized Manager Pattern for `@discordjs/next` -->

# 1. Introduction

Key supported use cases & goals:

- **Zero Caching:** The library must function perfectly even with caching completely disabled
- **Async, Remote Caching:** Support for external, asynchronous data stores like Redis
- **In-Memory Caching:** The traditional `Collection`-based synchronous cache (default)
- **Complete Flexibility**: Absolute user control over what is cached and for how long, without any internal assumptions or limitations

I ask readers to address the dedicated "Problems" sections in each part of the proposal, as well as any other general
concerns.

Also of note, I'm aware that we're going to be using some sort of dependency injection container. For the sake of simplicity,
this proposal just takes in the `Client` everywhere.

# 2. Design Principles

1. **Async-First:** All cache operations must return an `Awaitable<T>`
2. **Fetch-First:** Users should use `manager.fetch(id)` to get data. The manager will check the cache first, and if it misses
   (or if caching is disabled), it will hit the API
3. **Map-like:** The cache interface should remain map-like, as it currently is in mainlib

# 3. The Cache Interface

At this time, I think those are the primary methods that need implemented. They are most certainly enough for most use
cases. Some considerations around being able to iterate on the data should be made.

## Suggested Interface

```ts
import type { Awaitable } from '@discordjs/util';
import type { Structure } from '@discordjs/structures';
import type { Snowflake } from 'discord-api-types/globals';

export type RawAPIType<T> = T extends Structure<infer Raw, any> ? Raw : never;

export type StructureCreator<
	Value extends Structure<{ id: Snowflake }>,
	Raw extends RawAPIType<Value> = RawAPIType<Value>,
> = (data: Partial<Raw> & { id: Snowflake }) => Value;

export interface Cache<Value extends Structure<{ id: Snowflake }>, Raw extends RawAPIType<Value> = RawAPIType<Value>> {
	/**
	 * The function used to construct instances of the structure this cache holds.
	 */
	readonly construct: StructureCreator<Value, Raw>;

	/**
	 * Retrieves an item from the cache.
	 */
	get(key: Snowflake): Awaitable<Value | undefined>;

	/**
	 * Sets an item in the cache.
	 */
	set(key: Snowflake, value: Value): Awaitable<void>;

	/**
	 * Adds or updates data in the cache, returning the instantiated structure.
	 * If the item exists, it patches it with the new data unless `overwrite` is true.
	 * If it does not exist, it constructs a new instance and stores it.
	 */
	add(data: Partial<Raw> & { id: Snowflake }, overwrite?: boolean): Awaitable<Value>;

	/**
	 * Checks if an item exists in the cache.
	 */
	has(key: Snowflake): Awaitable<boolean>;

	/**
	 * Deletes an item from the cache.
	 */
	delete(key: Snowflake): Awaitable<boolean>;

	/**
	 * Clears all items from the cache.
	 */
	clear(): Awaitable<void>;

	/**
	 * Gets the number of items in the cache.
	 */
	getSize(): Awaitable<number>;
}
```

[^1]

## Problems

- Consider use cases that require iterating over cached items. `keys()`, `values()`, and `entries()` could be added,
  but they raise some type questions. They probably have to return `AsyncIterable | Iterable`?
- It's possible there's an oversight with `add` being so highly-responsible (i.e. functioning as more of an upsert).

# 4. The Manager Pattern

## Suggested implementation

```ts
import type { Client } from '../client/Client.js';
import type { Cache, RawAPIType } from '../cache/Cache.js';
import type { Structure } from '@discordjs/structures';
import type { Snowflake } from 'discord-api-types/globals';

export abstract class BaseManager<
	Value extends Structure<{ id: Snowflake }>,
	Raw extends RawAPIType<Value> = RawAPIType<Value>,
> {
	public constructor(
		public readonly client: Client,
		public readonly cache: Cache<Value, Raw>,
	) {}

	// Child classes provide methods specific to the endpoints they manage.
}
```

## Problems

- Considering `_add` is now notably absent, we can potentially justify just having an interface rather than a base class.
- Something to consider is that perhaps `StructureCreator` should be on the Manager rather than the Cache.
  I handled it this way to avoid the `Cache` needing a back-reference to the Manager, but we do end up with cases
  where Manager code has to `this.cache.construct`. Perhaps an option is for both the `Manager` and `Cache` to have it.

## Specific manager: UserManager

The `UserManager` implements the `fetch` method, which is the primary way users will interact with data.

```ts
import { BaseManager } from './BaseManager.js';
import { User } from '@discordjs/structures';
import type { APIUser } from 'discord-api-types/v10';
import type { Snowflake } from 'discord-api-types/globals';

export interface FetchOptions {
	/**
	 * Whether to skip the cache check and force an API request.
	 */
	force?: boolean;
	/**
	 * Whether to cache the fetched result.
	 */
	cache?: boolean;
}

export class UserManager extends BaseManager<User, APIUser> {
	/**
	 * Fetches a user by ID.
	 * Checks the cache first unless `force` is true.
	 */
	public async fetch(id: Snowflake, options: FetchOptions = {}): Promise<User> {
		const { force = false, cache = true } = options;

		if (!force) {
			const cached = await this.cache.get(id);
			if (cached) {
				return cached;
			}
		}

		// Cache miss or forced fetch. Hit the API.
		// Assuming `this.client.api` is an instance of `@discordjs/core` API
		const rawUser = await this.client.api.users.get(id);

		if (!cache) {
			return this.cache.construct(rawUser);
		}

		// Pass the raw data to the cache to handle caching and instantiation.
		// We pass overwrite=true because we know this is a fresh, complete object from the API.
		return await this.cache.add(rawUser, true);
	}

	// Other methods relevant to /users endpoints
}
```

## Note on `_add`

In the old implementation, `BaseManager` had an `_add` method responsible for instantiating structures and
patching existing ones. In this new design, that responsibility has been entirely shifted to the `Cache` interface.

# 5. Usage examples

```ts
// Userland code. Notably what you would do today
const user = await client.users.fetch('123456789012345678');
console.log(user.username);

// A difference that will very quickly & obviously pop up is around structures we normally guaranteed were cached:
const channel = await client.channels.fetch(process.env.SOME_CHANNEL_ID);
console.log(channel.name);

// Gateway Event Example (Internal Library Code)
client.ws.on('USER_UPDATE', async (partialData) => {
	// partialData might only contain { id: '...', username: 'new_name' }
	// A great aspect about this is that we have no cloning logic here! Patching logic under the hood does not mutate.
	// A drawback is that `add` will invoke `.get` internally as well. Might want to consider some method of optimization here.
	const existingUser = await client.users.cache.get(partialData.id);
	// Note: If the user is not in the cache, this will construct and cache a partial User structure.
	const updatedUser = await client.users.cache.add(partialData);
	if (existingUser) {
		client.emit('userUpdate', existingUser, updatedUser);
	}
});
```

# Footnotes

[^1] Derived from some existing work/PoC done in #10983
