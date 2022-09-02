import type { Type } from './index.js';

export interface Return {
	description?: string;
	nullable?: boolean;
	type: Required<Type>;
}
