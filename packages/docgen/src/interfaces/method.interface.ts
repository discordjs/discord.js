import type { Access, Exception, Item, Meta, Param, Return, Scope } from './index.js';

export interface Method extends Item {
	access?: Access;
	async?: boolean;
	deprecated?: boolean | string;
	examples?: string[];
	exceptions?: Exception[];
	fires?: string[];
	generator?: boolean;
	implements?: string[];
	inherited?: boolean;
	inherits?: string;
	kind: 'function';
	memberof?: string;
	meta: Meta;
	params?: Param[];
	returns?: Return[];
	scope: Scope;
	see?: string[];
	virtual?: boolean;
}
