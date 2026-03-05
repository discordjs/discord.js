import { expectTypeOf } from 'vitest';
import type { MixinTypes } from '../../src/MixinTypes.d.ts';
import type { kMixinConstruct } from '../../src/utils/symbols.js';
import type { MixinProperty1, Base, MixinProperty2 } from '../mixinClasses.js';

declare const extendsNoOmit: Omit<MixinProperty1, keyof Base | typeof kMixinConstruct>;
declare const extendsOmitProperty1: Omit<MixinProperty1<'property1'>, keyof Base | typeof kMixinConstruct>;
declare const extendsBothNoOmit: Omit<MixinProperty1 & MixinProperty2, keyof Base | typeof kMixinConstruct>;
declare const extendsBothOmitProperty1: Omit<
	MixinProperty1<'property1'> & MixinProperty2<'property1'>,
	keyof Base | typeof kMixinConstruct
>;
declare const extendsBothOmitBoth: Omit<
	MixinProperty1<'property1'> & MixinProperty2<'property2'>,
	keyof Base | typeof kMixinConstruct
>;

expectTypeOf(extendsNoOmit).toEqualTypeOf<MixinTypes<Base, [MixinProperty1]>>();
expectTypeOf(extendsOmitProperty1).toEqualTypeOf<MixinTypes<Base<'property1'>, [MixinProperty1<'property1'>]>>();
expectTypeOf(extendsOmitProperty1).not.toEqualTypeOf<MixinTypes<Base, [MixinProperty1]>>();
expectTypeOf(extendsNoOmit).not.toEqualTypeOf<MixinTypes<Base<'property1'>, [MixinProperty1<'property1'>]>>();

expectTypeOf(extendsBothNoOmit).toEqualTypeOf<MixinTypes<Base, [MixinProperty1, MixinProperty2]>>();
// Since MixinProperty2 doesn't utilize the type of property1 in kData, this works and is ok
expectTypeOf(extendsBothOmitProperty1).toEqualTypeOf<
	MixinTypes<Base<'property1'>, [MixinProperty1<'property1'>, MixinProperty2]>
>();
expectTypeOf(extendsBothOmitProperty1).not.toEqualTypeOf<MixinTypes<Base, [MixinProperty1, MixinProperty2]>>();
// Since MixinProperty2 doesn't utilize the type of property1 in kData, this works and is ok
expectTypeOf(extendsBothNoOmit).not.toEqualTypeOf<
	MixinTypes<Base<'property1'>, [MixinProperty1<'property1'>, MixinProperty2]>
>();

// Earlier mixins in the list must specify all properties because of the way merging works
expectTypeOf(extendsBothOmitBoth).toEqualTypeOf<
	MixinTypes<Base<'property1' | 'property2'>, [MixinProperty1<'property1' | 'property2'>, MixinProperty2<'property2'>]>
>();

expectTypeOf<MixinTypes<Base<'property1'>, [MixinProperty1]>>().toBeNever();
// @ts-expect-error Shouldn't be able to assign non identical omits
expectTypeOf<MixinTypes<Base, [MixinProperty1<'property1'>]>>()
	// Separate line so ts-expect-error doesn't match this ever
	.toBeNever();
