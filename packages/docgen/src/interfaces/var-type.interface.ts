import type { Type } from './index.js';

export interface VarType extends Type {
	type?: Required<Type>;
	description?: string;
	nullable?: boolean;
}
