/**
 * @internal
 */
interface CollectionConstructor {
    new (): Collection<unknown, unknown>;
    new <K, V>(entries?: ReadonlyArray<readonly [K, V]> | null): Collection<K, V>;
    new <K, V>(iterable: Iterable<readonly [K, V]>): Collection<K, V>;
    readonly prototype: Collection<unknown, unknown>;
    readonly [Symbol.species]: CollectionConstructor;
}
/**
 * Represents an immutable version of a collection
 */
declare type ReadonlyCollection<K, V> = ReadonlyMap<K, V> & Omit<Collection<K, V>, 'forEach' | 'ensure' | 'reverse' | 'sweep' | 'sort' | 'get' | 'set' | 'delete'>;
/**
 * Separate interface for the constructor so that emitted js does not have a constructor that overwrites itself
 *
 * @internal
 */
interface Collection<K, V> extends Map<K, V> {
    constructor: CollectionConstructor;
}
/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 */
declare class Collection<K, V> extends Map<K, V> {
    static readonly default: typeof Collection;
    /**
     * Obtains the value of the given key if it exists, otherwise sets and returns the value provided by the default value generator.
     *
     * @param key The key to get if it exists, or set otherwise
     * @param defaultValueGenerator A function that generates the default value
     *
     * @example
     * collection.ensure(guildId, () => defaultGuildConfig);
     */
    ensure(key: K, defaultValueGenerator: (key: K, collection: this) => V): V;
    /**
     * Checks if all of the elements exist in the collection.
     *
     * @param keys - The keys of the elements to check for
     *
     * @returns `true` if all of the elements exist, `false` if at least one does not exist.
     */
    hasAll(...keys: K[]): boolean;
    /**
     * Checks if any of the elements exist in the collection.
     *
     * @param keys - The keys of the elements to check for
     *
     * @returns `true` if any of the elements exist, `false` if none exist.
     */
    hasAny(...keys: K[]): boolean;
    /**
     * Obtains the first value(s) in this collection.
     *
     * @param amount Amount of values to obtain from the beginning
     *
     * @returns A single value if no amount is provided or an array of values, starting from the end if amount is negative
     */
    first(): V | undefined;
    first(amount: number): V[];
    /**
     * Obtains the first key(s) in this collection.
     *
     * @param amount Amount of keys to obtain from the beginning
     *
     * @returns A single key if no amount is provided or an array of keys, starting from the end if
     * amount is negative
     */
    firstKey(): K | undefined;
    firstKey(amount: number): K[];
    /**
     * Obtains the last value(s) in this collection.
     *
     * @param amount Amount of values to obtain from the end
     *
     * @returns A single value if no amount is provided or an array of values, starting from the start if
     * amount is negative
     */
    last(): V | undefined;
    last(amount: number): V[];
    /**
     * Obtains the last key(s) in this collection.
     *
     * @param amount Amount of keys to obtain from the end
     *
     * @returns A single key if no amount is provided or an array of keys, starting from the start if
     * amount is negative
     */
    lastKey(): K | undefined;
    lastKey(amount: number): K[];
    /**
     * Identical to [Array.at()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).
     * Returns the item at a given index, allowing for positive and negative integers.
     * Negative integers count back from the last item in the collection.
     *
     * @param index The index of the element to obtain
     */
    at(index: number): V | undefined;
    /**
     * Identical to [Array.at()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).
     * Returns the key at a given index, allowing for positive and negative integers.
     * Negative integers count back from the last item in the collection.
     *
     * @param index The index of the key to obtain
     */
    keyAt(index: number): K | undefined;
    /**
     * Obtains unique random value(s) from this collection.
     *
     * @param amount Amount of values to obtain randomly
     *
     * @returns A single value if no amount is provided or an array of values
     */
    random(): V | undefined;
    random(amount: number): V[];
    /**
     * Obtains unique random key(s) from this collection.
     *
     * @param amount Amount of keys to obtain randomly
     *
     * @returns A single key if no amount is provided or an array
     */
    randomKey(): K | undefined;
    randomKey(amount: number): K[];
    /**
     * Identical to [Array.reverse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)
     * but returns a Collection instead of an Array.
     */
    reverse(): this;
    /**
     * Searches for a single item where the given function returns a truthy value. This behaves like
     * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
     * <warn>All collections used in Discord.js are mapped using their `id` property, and if you want to find by id you
     * should use the `get` method. See
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get) for details.</warn>
     *
     * @param fn The function to test with (should return boolean)
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * collection.find(user => user.username === 'Bob');
     */
    find<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): V2 | undefined;
    find(fn: (value: V, key: K, collection: this) => boolean): V | undefined;
    find<This, V2 extends V>(fn: (this: This, value: V, key: K, collection: this) => value is V2, thisArg: This): V2 | undefined;
    find<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): V | undefined;
    /**
     * Searches for the key of a single item where the given function returns a truthy value. This behaves like
     * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex),
     * but returns the key rather than the positional index.
     *
     * @param fn The function to test with (should return boolean)
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * collection.findKey(user => user.username === 'Bob');
     */
    findKey<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): K2 | undefined;
    findKey(fn: (value: V, key: K, collection: this) => boolean): K | undefined;
    findKey<This, K2 extends K>(fn: (this: This, value: V, key: K, collection: this) => key is K2, thisArg: This): K2 | undefined;
    findKey<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): K | undefined;
    /**
     * Removes items that satisfy the provided filter function.
     *
     * @param fn Function used to test (should return a boolean)
     * @param thisArg Value to use as `this` when executing function
     *
     * @returns The number of removed entries
     */
    sweep(fn: (value: V, key: K, collection: this) => boolean): number;
    sweep<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): number;
    /**
     * Identical to
     * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
     * but returns a Collection instead of an Array.
     *
     * @param fn The function to test with (should return boolean)
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * collection.filter(user => user.username === 'Bob');
     */
    filter<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): Collection<K2, V>;
    filter<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): Collection<K, V2>;
    filter(fn: (value: V, key: K, collection: this) => boolean): Collection<K, V>;
    filter<This, K2 extends K>(fn: (this: This, value: V, key: K, collection: this) => key is K2, thisArg: This): Collection<K2, V>;
    filter<This, V2 extends V>(fn: (this: This, value: V, key: K, collection: this) => value is V2, thisArg: This): Collection<K, V2>;
    filter<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): Collection<K, V>;
    /**
     * Partitions the collection into two collections where the first collection
     * contains the items that passed and the second contains the items that failed.
     *
     * @param fn Function used to test (should return a boolean)
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * const [big, small] = collection.partition(guild => guild.memberCount > 250);
     */
    partition<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): [Collection<K2, V>, Collection<Exclude<K, K2>, V>];
    partition<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): [Collection<K, V2>, Collection<K, Exclude<V, V2>>];
    partition(fn: (value: V, key: K, collection: this) => boolean): [Collection<K, V>, Collection<K, V>];
    partition<This, K2 extends K>(fn: (this: This, value: V, key: K, collection: this) => key is K2, thisArg: This): [Collection<K2, V>, Collection<Exclude<K, K2>, V>];
    partition<This, V2 extends V>(fn: (this: This, value: V, key: K, collection: this) => value is V2, thisArg: This): [Collection<K, V2>, Collection<K, Exclude<V, V2>>];
    partition<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): [Collection<K, V>, Collection<K, V>];
    /**
     * Maps each item into a Collection, then joins the results into a single Collection. Identical in behavior to
     * [Array.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap).
     *
     * @param fn Function that produces a new Collection
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * collection.flatMap(guild => guild.members.cache);
     */
    flatMap<T>(fn: (value: V, key: K, collection: this) => Collection<K, T>): Collection<K, T>;
    flatMap<T, This>(fn: (this: This, value: V, key: K, collection: this) => Collection<K, T>, thisArg: This): Collection<K, T>;
    /**
     * Maps each item to another value into an array. Identical in behavior to
     * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
     *
     * @param fn Function that produces an element of the new array, taking three arguments
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * collection.map(user => user.tag);
     */
    map<T>(fn: (value: V, key: K, collection: this) => T): T[];
    map<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): T[];
    /**
     * Maps each item to another value into a collection. Identical in behavior to
     * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
     *
     * @param fn Function that produces an element of the new collection, taking three arguments
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * collection.mapValues(user => user.tag);
     */
    mapValues<T>(fn: (value: V, key: K, collection: this) => T): Collection<K, T>;
    mapValues<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): Collection<K, T>;
    /**
     * Checks if there exists an item that passes a test. Identical in behavior to
     * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
     *
     * @param fn Function used to test (should return a boolean)
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * collection.some(user => user.discriminator === '0000');
     */
    some(fn: (value: V, key: K, collection: this) => boolean): boolean;
    some<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): boolean;
    /**
     * Checks if all items passes a test. Identical in behavior to
     * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
     *
     * @param fn Function used to test (should return a boolean)
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * collection.every(user => !user.bot);
     */
    every<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): this is Collection<K2, V>;
    every<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): this is Collection<K, V2>;
    every(fn: (value: V, key: K, collection: this) => boolean): boolean;
    every<This, K2 extends K>(fn: (this: This, value: V, key: K, collection: this) => key is K2, thisArg: This): this is Collection<K2, V>;
    every<This, V2 extends V>(fn: (this: This, value: V, key: K, collection: this) => value is V2, thisArg: This): this is Collection<K, V2>;
    every<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): boolean;
    /**
     * Applies a function to produce a single value. Identical in behavior to
     * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
     *
     * @param fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
     * and `collection`
     * @param initialValue Starting value for the accumulator
     *
     * @example
     * collection.reduce((acc, guild) => acc + guild.memberCount, 0);
     */
    reduce<T>(fn: (accumulator: T, value: V, key: K, collection: this) => T, initialValue?: T): T;
    /**
     * Identical to
     * [Map.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach),
     * but returns the collection instead of undefined.
     *
     * @param fn Function to execute for each element
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * collection
     *  .each(user => console.log(user.username))
     *  .filter(user => user.bot)
     *  .each(user => console.log(user.username));
     */
    each(fn: (value: V, key: K, collection: this) => void): this;
    each<T>(fn: (this: T, value: V, key: K, collection: this) => void, thisArg: T): this;
    /**
     * Runs a function on the collection and returns the collection.
     *
     * @param fn Function to execute
     * @param thisArg Value to use as `this` when executing function
     *
     * @example
     * collection
     *  .tap(coll => console.log(coll.size))
     *  .filter(user => user.bot)
     *  .tap(coll => console.log(coll.size))
     */
    tap(fn: (collection: this) => void): this;
    tap<T>(fn: (this: T, collection: this) => void, thisArg: T): this;
    /**
     * Creates an identical shallow copy of this collection.
     *
     * @example
     * const newColl = someColl.clone();
     */
    clone(): Collection<K, V>;
    /**
     * Combines this collection with others into a new collection. None of the source collections are modified.
     *
     * @param collections Collections to merge
     *
     * @example
     * const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
     */
    concat(...collections: ReadonlyCollection<K, V>[]): Collection<K, V>;
    /**
     * Checks if this collection shares identical items with another.
     * This is different to checking for equality using equal-signs, because
     * the collections may be different objects, but contain the same data.
     *
     * @param collection Collection to compare with
     *
     * @returns Whether the collections have identical contents
     */
    equals(collection: ReadonlyCollection<K, V>): boolean;
    /**
     * The sort method sorts the items of a collection in place and returns it.
     * The sort is not necessarily stable in Node 10 or older.
     * The default sort order is according to string Unicode code points.
     *
     * @param compareFunction Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value, according to the string conversion of each element.
     *
     * @example
     * collection.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    sort(compareFunction?: Comparator<K, V>): this;
    /**
     * The intersect method returns a new structure containing items where the keys and values are present in both original structures.
     *
     * @param other The other Collection to filter against
     */
    intersect<T>(other: ReadonlyCollection<K, T>): Collection<K, T>;
    /**
     * The difference method returns a new structure containing items where the key is present in one of the original structures but not the other.
     *
     * @param other The other Collection to filter against
     */
    difference<T>(other: ReadonlyCollection<K, T>): Collection<K, V | T>;
    /**
     * Merges two Collections together into a new Collection.
     * @param other The other Collection to merge with
     * @param whenInSelf Function getting the result if the entry only exists in this Collection
     * @param whenInOther Function getting the result if the entry only exists in the other Collection
     * @param whenInBoth Function getting the result if the entry exists in both Collections
     *
     * @example
     * // Sums up the entries in two collections.
     * coll.merge(
     *  other,
     *  x => ({ keep: true, value: x }),
     *  y => ({ keep: true, value: y }),
     *  (x, y) => ({ keep: true, value: x + y }),
     * );
     *
     * @example
     * // Intersects two collections in a left-biased manner.
     * coll.merge(
     *  other,
     *  x => ({ keep: false }),
     *  y => ({ keep: false }),
     *  (x, _) => ({ keep: true, value: x }),
     * );
     */
    merge<T, R>(other: ReadonlyCollection<K, T>, whenInSelf: (value: V, key: K) => Keep<R>, whenInOther: (valueOther: T, key: K) => Keep<R>, whenInBoth: (value: V, valueOther: T, key: K) => Keep<R>): Collection<K, R>;
    /**
     * The sorted method sorts the items of a collection and returns it.
     * The sort is not necessarily stable in Node 10 or older.
     * The default sort order is according to string Unicode code points.
     *
     * @param compareFunction Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     *
     * @example
     * collection.sorted((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    sorted(compareFunction?: Comparator<K, V>): Collection<K, V>;
    toJSON(): V[];
    private static defaultSort;
    /**
     * Creates a Collection from a list of entries.
     * @param entries The list of entries
     * @param combine Function to combine an existing entry with a new one
     *
     * @example
     * Collection.combineEntries([["a", 1], ["b", 2], ["a", 2]], (x, y) => x + y);
     * // returns Collection { "a" => 3, "b" => 2 }
     */
    static combineEntries<K, V>(entries: Iterable<[K, V]>, combine: (firstValue: V, secondValue: V, key: K) => V): Collection<K, V>;
}
/**
 * @internal
 */
declare type Keep<V> = {
    keep: true;
    value: V;
} | {
    keep: false;
};
/**
 * @internal
 */
declare type Comparator<K, V> = (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number;

export { Collection, CollectionConstructor, Comparator, Keep, ReadonlyCollection, Collection as default };
