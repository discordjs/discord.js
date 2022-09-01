import type { Item, Meta } from './index.js';

export interface External extends Item {
	kind: 'external';
	meta: Meta;
	see?: string[];
}
