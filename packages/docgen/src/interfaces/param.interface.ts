import type { Type } from './index.js';

export interface Param {
	type: Type;
	description: string;
	name: string;
	optional?: boolean;
	defaultvalue?: string;
	variable?: string;
	nullable?: boolean;
}
