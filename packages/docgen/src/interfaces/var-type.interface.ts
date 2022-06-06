import type { Type } from './index.js';

export interface VarType extends Type {
	description?: string;
	nullable?: boolean;
}
