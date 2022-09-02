import type { Type } from './index.js';

export interface Exception {
	description?: string;
	nullable?: boolean;
	type: Type;
}
