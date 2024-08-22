import type { Type } from './index.js';

export interface Param {
	defaultvalue?: string;
	description: string;
	name: string;
	nullable?: boolean;
	optional?: boolean;
	type: Type;
	variable?: string;
}
