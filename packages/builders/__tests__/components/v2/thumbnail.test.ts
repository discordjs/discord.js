import { ComponentType } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { ThumbnailBuilder } from '../../../src/components/v2/Thumbnail';

const dummy = {
	type: ComponentType.Thumbnail as const,
	media: { url: 'https://google.com' },
};

describe('Thumbnail', () => {
	describe('Thumbnail url', () => {
		test('GIVEN a thumbnail with a pre-defined url THEN return valid toJSON data', () => {
			const thumbnail = new ThumbnailBuilder({ media: { url: 'https://google.com' } });
			expect(thumbnail.toJSON()).toEqual({ type: ComponentType.Thumbnail, media: { url: 'https://google.com' } });
		});

		test('GIVEN a thumbnail with a set url THEN return valid toJSON data', () => {
			const thumbnail = new ThumbnailBuilder().setURL('https://google.com');
			expect(thumbnail.toJSON()).toEqual({ type: ComponentType.Thumbnail, media: { url: 'https://google.com' } });
		});

		test.each(['owo', 'discord://user'])('GIVEN a thumbnail with an invalid URL (%s) THEN throws error', (input) => {
			const thumbnail = new ThumbnailBuilder();

			expect(() => thumbnail.setURL(input)).toThrowError();
		});
	});

	describe('Thumbnail description', () => {
		test('GIVEN a thumbnail with a pre-defined description THEN return valid toJSON data', () => {
			const thumbnail = new ThumbnailBuilder({ ...dummy, description: 'foo' });
			expect(thumbnail.toJSON()).toEqual({ ...dummy, description: 'foo' });
		});

		test('GIVEN a thumbnail with a set description THEN return valid toJSON data', () => {
			const thumbnail = new ThumbnailBuilder({ ...dummy });
			thumbnail.setDescription('foo');

			expect(thumbnail.toJSON()).toEqual({ ...dummy, description: 'foo' });
		});

		test('GIVEN a thumbnail with a pre-defined description THEN unset description THEN return valid toJSON data', () => {
			const thumbnail = new ThumbnailBuilder({ description: 'foo', ...dummy });
			thumbnail.clearDescription();

			expect(thumbnail.toJSON()).toEqual({ ...dummy });
		});

		test('GIVEN a thumbnail with an invalid description THEN throws error', () => {
			const thumbnail = new ThumbnailBuilder();

			expect(() => thumbnail.setDescription('a'.repeat(1_025))).toThrowError();
		});
	});

	describe('Thumbnail spoiler', () => {
		test('GIVEN a thumbnail with a pre-defined spoiler status THEN return valid toJSON data', () => {
			const thumbnail = new ThumbnailBuilder({ ...dummy, spoiler: true });
			expect(thumbnail.toJSON()).toEqual({ ...dummy, spoiler: true });
		});

		test('GIVEN a thumbnail with a set spoiler status THEN return valid toJSON data', () => {
			const thumbnail = new ThumbnailBuilder({ ...dummy });
			thumbnail.setSpoiler(false);

			expect(thumbnail.toJSON()).toEqual({ ...dummy, spoiler: false });
		});
	});
});
