import type { MixinTypes } from '../src/Mixin.js';
import { Mixin } from '../src/Mixin.js';
import { Structure } from '../src/Structure.js';
import { kData, kMixinConstruct } from '../src/utils/symbols.js';

export interface APIData {
	baseOptimize?: string;
	id: string;
	mixinOptimize?: string;
	property1?: number;
	property2?: boolean;
}

export interface Base {
	baseOptimize: boolean | null;
}
export class Base<Omitted extends keyof APIData | '' = ''> extends Structure<APIData, Omitted> {
	public static override DataTemplate = {
		set baseOptimize(_: unknown) {},
	};

	public constructor(data: APIData) {
		super(data);
		this.baseOptimize ??= null;
	}

	public override _patch(data: Partial<APIData>) {
		super._patch(data);
		return this;
	}

	public override _optimizeData(data: Partial<APIData>) {
		if ('baseOptimize' in data) {
			this.baseOptimize = Boolean(data.baseOptimize);
		}
	}

	public get id() {
		return this[kData].id;
	}

	public getId() {
		return this.id;
	}
}

export interface MixinProperty1<Omitted extends keyof APIData | '' = ''> extends Base<Omitted> {
	mixinOptimize: boolean | null;
}
export class MixinProperty1 {
	public static DataTemplate = {
		set mixinOptimize(_: unknown) {},
	};

	public [kMixinConstruct]() {
		this.mixinOptimize = null;
	}

	public _optimizeData(data: Partial<APIData>) {
		if ('mixinOptimize' in data) {
			this.mixinOptimize = Boolean(data.mixinOptimize);
		}
	}

	public get property1() {
		return this[kData].property1;
	}

	public getProperty1() {
		return this.property1;
	}
}

export interface MixinProperty2<Omitted extends keyof APIData | '' = ''> extends Base<Omitted> {
	constructCalled: boolean;
}
export class MixinProperty2 {
	public [kMixinConstruct]() {
		this.constructCalled = true;
	}

	public get property2() {
		return this[kData].property2;
	}

	public getProperty2() {
		return this.property2;
	}
}

export class ExtendedMixinProperty2 extends MixinProperty2 {
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	public get isExtended() {
		return true;
	}
}

export interface Mixed extends MixinTypes<Base, [MixinProperty1, MixinProperty2]> {}
export class Mixed extends Base {
	public getProperties() {
		return { property1: this.property1, property2: this.property2 };
	}
}

Mixin(Mixed, [MixinProperty1, MixinProperty2]);

export interface MixedWithExtended extends MixinTypes<Base, [MixinProperty1, ExtendedMixinProperty2]> {}
export class MixedWithExtended extends Base {
	public getProperties() {
		return {
			property1: this.property1,
			property2: this.property2,
		};
	}
}

// Intentiontally don't directly mix Property 2
Mixin(MixedWithExtended, [MixinProperty1, ExtendedMixinProperty2]);
