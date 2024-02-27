import type { MixinTypes } from '../src/Mixin.js';
import { Mixin } from '../src/Mixin.js';
import { Structure } from '../src/Structure.js';
import { kData } from '../src/utils/symbols.js';

export interface APIData {
	id: string;
	property1?: number;
	property2?: boolean;
}

export class Base<Omitted extends keyof APIData | '' = ''> extends Structure<APIData, Omitted> {
	public constructor(data: APIData) {
		super(data);
	}

	public get id() {
		return this[kData].id;
	}

	public getId() {
		return this.id;
	}
}

export interface MixinProperty1<Omitted extends keyof APIData | '' = ''> extends Base<Omitted> {}
export class MixinProperty1 {
	public get property1() {
		return this[kData].property1;
	}

	public getProperty1() {
		return this.property1;
	}
}

export interface MixinProperty2<Omitted extends keyof APIData | '' = ''> extends Base<Omitted> {}
export class MixinProperty2 {
	public get property2() {
		return this[kData].property2;
	}

	public getProperty2() {
		return this.property2;
	}
}

export interface Mixed extends MixinTypes<Base, [MixinProperty1, MixinProperty2]> {}
export class Mixed extends Base {
	public getProperties() {
		return { property1: this.property1, property2: this.property2 };
	}
}

Mixin(Mixed, [MixinProperty1, MixinProperty2]);
