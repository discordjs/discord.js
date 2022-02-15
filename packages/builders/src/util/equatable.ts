export interface Equatable<T> {
	equals: (other: T) => boolean;
}
