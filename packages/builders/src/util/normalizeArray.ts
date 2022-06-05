export function normalizeArray<T>(arr: RestOrArray<T>): T[] {
	if (Array.isArray(arr[0])) return arr[0];
	return arr as T[];
}

export type RestOrArray<T> = T[] | [T[]];
