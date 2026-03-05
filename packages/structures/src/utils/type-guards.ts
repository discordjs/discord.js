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
