import type { Type } from './index.js';

export interface VarType extends Type {
	type?: Required<Type> | undefined;
	description?: string | undefined;
	nullable?: boolean | undefined;
}
