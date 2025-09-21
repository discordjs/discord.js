export function isIdSet(id: unknown): id is bigint | string {
	return typeof id === 'string' || typeof id === 'bigint';
}
