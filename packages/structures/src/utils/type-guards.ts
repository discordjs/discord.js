export function isIdSet(id: unknown): id is bigint | string {
	return typeof id === 'string' || typeof id === 'bigint';
}

interface TypeMap {
	bigint: bigint;
	boolean: boolean;
	function(...args: any[]): unknown;
	number: number;
	object: object;
	string: string;
	symbol: symbol;
	undefined: undefined;
}

export type TypeofType = keyof TypeMap;

function hasProperty<Value extends object, Key extends string>(
	data: Value,
	fieldName: Key,
): data is Record<Key, unknown> & Value {
	return fieldName in data;
}

export function isFieldSet<Value extends object, Key extends string, Type extends TypeofType>(
	data: Value,
	fieldName: Key,
	type: Type,
): data is Record<Key, TypeMap[Type]> & Value {
	// eslint-disable-next-line valid-typeof
	return hasProperty(data, fieldName) && typeof data[fieldName] === type;
}

/**
 * This typeguard will determine whether a specified array field is the specified
 * type.
 *
 * @internal
 * @param array - The target array from which the target index will be narrowed
 * @param targetIndex - The target index of the element whose type to narrow
 * @param type - The type to compare against
 */
export function isArrayFieldSet<Type extends TypeofType, Index extends number>(
	array: unknown,
	targetIndex: Index,
	type: Type,
): array is Record<Index, Type> & unknown[] {
	return Array.isArray(array)
		? array.length >= targetIndex
			? // eslint-disable-next-line valid-typeof
				typeof array[targetIndex] === type
			: false
		: false;
}
