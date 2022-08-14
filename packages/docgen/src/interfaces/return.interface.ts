import type { Type } from './index.js';

export interface Return {
	type: Required<Type>;
	nullable?: boolean;
	description?: string;
}
