import { expectNotType, expectType } from 'tsd';
import { expectTypeOf } from 'vitest';
import type { MixinTypes } from '../../src/Mixin.js';
import type { MixinProperty1, Base, MixinProperty2 } from '../mixinClasses.js';

declare const extendsNoOmit: Omit<MixinProperty1, keyof Base>;
declare const extendsOmitProperty1: Omit<MixinProperty1<'property1'>, keyof Base>;
declare const extendsBothNoOmit: Omit<MixinProperty1 & MixinProperty2, keyof Base>;
declare const extendsBothOmitProperty1: Omit<MixinProperty1<'property1'> & MixinProperty2<'property1'>, keyof Base>;
declare const extendsBothOmitBoth: Omit<MixinProperty1<'property1'> & MixinProperty2<'property2'>, keyof Base>;

expectType<MixinTypes<Base, [MixinProperty1]>>(extendsNoOmit);
expectType<MixinTypes<Base<'property1'>, [MixinProperty1<'property1'>]>>(extendsOmitProperty1);
expectNotType<MixinTypes<Base, [MixinProperty1]>>(extendsOmitProperty1);
expectNotType<MixinTypes<Base<'property1'>, [MixinProperty1<'property1'>]>>(extendsNoOmit);

expectType<MixinTypes<Base, [MixinProperty1, MixinProperty2]>>(extendsBothNoOmit);
// Since MixinProperty2 doesn't utilize the type of property1 in kData, this works and is ok
expectType<MixinTypes<Base<'property1'>, [MixinProperty1<'property1'>, MixinProperty2]>>(extendsBothOmitProperty1);
expectNotType<MixinTypes<Base, [MixinProperty1, MixinProperty2]>>(extendsBothOmitProperty1);
// Since MixinProperty2 doesn't utilize the type of property1 in kData, this works and is ok
expectNotType<MixinTypes<Base<'property1'>, [MixinProperty1<'property1'>, MixinProperty2]>>(extendsBothNoOmit);

// Earlier mixins in the list must specify all properties because of the way merging works
expectType<
	MixinTypes<Base<'property1' | 'property2'>, [MixinProperty1<'property1' | 'property2'>, MixinProperty2<'property2'>]>
>(extendsBothOmitBoth);

expectTypeOf<MixinTypes<Base<'property1'>, [MixinProperty1]>>().toBeNever();
// @ts-expect-error Shouldn't be able to assign non identical omits
expectTypeOf<MixinTypes<Base, [MixinProperty1<'property1'>]>>()
	// Separate line so ts-expect-error doesn't match this ever
	.toBeNever();
