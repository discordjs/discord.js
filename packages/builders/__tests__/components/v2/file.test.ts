import { ComponentType } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { FileBuilder } from '../../../src/components/v2/File';

const dummy = {
	type: ComponentType.File as const,
	file: { url: 'attachment://owo.png' },
};

describe('File', () => {
	describe('File url', () => {
		test('GIVEN a file with a pre-defined url THEN return valid toJSON data', () => {
			const file = new FileBuilder({ file: { url: 'attachment://owo.png' } });
			expect(file.toJSON()).toEqual({ ...dummy, file: { url: 'attachment://owo.png' } });
		});

		test('GIVEN a file using File#setURL THEN return valid toJSON data', () => {
			const file = new FileBuilder();
			file.setURL('attachment://uwu.png');

			expect(file.toJSON()).toEqual({ ...dummy, file: { url: 'attachment://uwu.png' } });
		});

		test('GIVEN a file with an invalid url THEN throws error', () => {
			const file = new FileBuilder();

			expect(() => file.setURL('https://google.com')).toThrowError();
		});
	});

	describe('File spoiler', () => {
		test('GIVEN a file with a pre-defined spoiler status THEN return valid toJSON data', () => {
			const file = new FileBuilder({ ...dummy, spoiler: true });
			expect(file.toJSON()).toEqual({ ...dummy, spoiler: true });
		});

		test('GIVEN a file using File#setSpoiler THEN return valid toJSON data', () => {
			const file = new FileBuilder({ ...dummy });
			file.setSpoiler(false);

			expect(file.toJSON()).toEqual({ ...dummy, spoiler: false });
		});
	});
});
