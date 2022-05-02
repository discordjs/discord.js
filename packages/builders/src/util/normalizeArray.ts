export function normalizeArray<T>(...arr: T[] | T[][]): T[] {
	if (Array.isArray(arr[0])) return [...arr[0]];
	return [...arr] as T[];
}

export type RestOrArray<T> = T[] | T[][];
