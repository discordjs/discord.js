import type { Type } from './index.js';

export interface Return {
	type: Type;
	nullable?: boolean;
	description?: string;
}
