import { describe, expect, test } from 'vitest';
import { parseDocsPathParams } from '../../src/util/parseDocsPathParams';

describe('parseDocsPathParams', () => {
	test('no item', () => {
		expect(parseDocsPathParams(undefined)).toStrictEqual({ entryPoints: [], foundItem: undefined });
	});

	test('entry point without item', () => {
		expect(parseDocsPathParams(['v10'])).toStrictEqual({ entryPoints: ['v10'], foundItem: undefined });
	});

	test('empty trailing segment falls back to the default entry point', () => {
		expect(parseDocsPathParams([''])).toStrictEqual({ entryPoints: ['v10'], foundItem: undefined });
	});

	test('raw (non-decoded) item', () => {
		expect(parseDocsPathParams(['bold%3AFunction'])).toStrictEqual({
			entryPoints: [],
			foundItem: 'bold%3AFunction',
		});
	});

	test('raw (non-decoded) item with lowercase type marker', () => {
		expect(parseDocsPathParams(['bold%3aFunction'])).toStrictEqual({
			entryPoints: [],
			foundItem: 'bold%3aFunction',
		});
	});

	test('decoded item', () => {
		expect(parseDocsPathParams(['bold:Function'])).toStrictEqual({
			entryPoints: [],
			foundItem: 'bold:Function',
		});
	});

	test('entry point with raw (non-decoded) item', () => {
		expect(parseDocsPathParams(['v10', 'ChannelType%3AEnum'])).toStrictEqual({
			entryPoints: ['v10'],
			foundItem: 'ChannelType%3AEnum',
		});
	});

	test('entry point with decoded item', () => {
		expect(parseDocsPathParams(['v10', 'ChannelType:Enum'])).toStrictEqual({
			entryPoints: ['v10'],
			foundItem: 'ChannelType:Enum',
		});
	});

	test('multi-segment entry point without item', () => {
		expect(parseDocsPathParams(['v10', 'payloads'])).toStrictEqual({
			entryPoints: ['v10', 'payloads'],
			foundItem: undefined,
		});
	});

	test('multi-segment entry point with decoded item', () => {
		expect(parseDocsPathParams(['v10', 'payloads', 'ChannelType:Enum'])).toStrictEqual({
			entryPoints: ['v10', 'payloads'],
			foundItem: 'ChannelType:Enum',
		});
	});
});
