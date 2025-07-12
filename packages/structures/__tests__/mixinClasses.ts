import { Mixin } from '../src/Mixin.js';
import type { MixinTypes } from '../src/MixinTypes.d.ts';
import { Structure } from '../src/Structure.js';
import { kData, kMixinConstruct, kMixinToJSON, kPatch } from '../src/utils/symbols.js';

export interface APIData {
	baseOptimize?: string;
	id: string;
	mixinOptimize?: string;
	property1?: number;
	property2?: boolean;
}

export class Base<Omitted extends keyof APIData | '' = ''> extends Structure<APIData, Omitted> {
	public static override readonly DataTemplate = {
		set baseOptimize(_: unknown) {},
	};

	public baseOptimize: boolean | null = null;

	public constructor(data: APIData) {
		super(data);
		this.optimizeData(data);
	}

	public override [kPatch](data: Partial<APIData>) {
		super[kPatch](data);
		return this;
	}

	public override optimizeData(data: Partial<APIData>) {
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

	public override toJSON() {
		const data = super.toJSON();
		if (this.baseOptimize) {
			data.baseOptimize = String(this.baseOptimize);
		}

		return data;
	}
}

export interface MixinProperty1<Omitted extends keyof APIData | '' = ''> extends Base<Omitted> {
	mixinOptimize: boolean | null;
}
export class MixinProperty1 {
	public static readonly DataTemplate = {
		set mixinOptimize(_: unknown) {},
	};

	public [kMixinConstruct]() {
		this.mixinOptimize = null;
	}

	public optimizeData(data: Partial<APIData>) {
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

	protected [kMixinToJSON](data: Partial<APIData>) {
		if (this.mixinOptimize) {
			data.mixinOptimize = String(this.mixinOptimize);
		}
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

// Intentionally don't directly mix Property 2
Mixin(MixedWithExtended, [MixinProperty1, ExtendedMixinProperty2]);
