import type { Type } from './index.js';

export interface Exception {
	type: Type;
	nullable?: boolean;
	description?: string;
}
