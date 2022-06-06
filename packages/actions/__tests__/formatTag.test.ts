import { describe, test, expect } from 'vitest';
import { formatTag } from '../src';

describe('Format Tag', () => {
	test('GIVEN tag with a prefix THEN format tag to not contain the prefix', () => {
		expect(formatTag('@discordjs/rest@0.4.0')).toEqual({ package: 'rest', semver: '0.4.0' });
		expect(formatTag('@discordjs/collection@0.6.0')).toEqual({ package: 'collection', semver: '0.6.0' });
		expect(formatTag('@discordjs/proxy@0.1.0')).toEqual({ package: 'proxy', semver: '0.1.0' });
		expect(formatTag('@discordjs/builders@0.13.0')).toEqual({ package: 'builders', semver: '0.13.0' });
		expect(formatTag('@discordjs/voice@0.9.0')).toEqual({ package: 'voice', semver: '0.9.0' });
	});

	test('GIVEN tag with no prefix THEN return tag', () => {
		expect(formatTag('13.5.1')).toEqual({ semver: '13.5.1' });
		expect(formatTag('13.7.0')).toEqual({ package: undefined, semver: '13.7.0' });
	});

	test('GIVEN no or invalid tag THEN return null', () => {
		expect(formatTag('')).toEqual(null);
		expect(formatTag('abc')).toEqual(null);
	});
});
