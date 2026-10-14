import { expectTypeOf, test } from 'vitest';
import type { RequestInitLike, RESTOptions } from '../src/index.js';

test('request strategies receive only the options REST provides', () => {
	expectTypeOf<keyof RequestInitLike>().toEqualTypeOf<'body' | 'dispatcher' | 'headers' | 'method' | 'signal'>();
	expectTypeOf<RequestInitLike['headers']>().toEqualTypeOf<Record<string, string>>();
	expectTypeOf<RequestInitLike['method']>().toEqualTypeOf<string>();
	expectTypeOf<Parameters<RESTOptions['makeRequest']>[1]>().toEqualTypeOf<RequestInitLike>();
	expectTypeOf<FormData>().toExtend<RequestInitLike['body']>();
});
