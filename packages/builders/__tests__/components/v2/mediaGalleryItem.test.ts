import { describe, expect, test } from 'vitest';
import { MediaGalleryItemBuilder } from '../../../src/components/v2/MediaGalleryItem';

const dummy = {
	media: { url: 'https://google.com' },
};

describe('MediaGalleryItem', () => {
	describe('MediaGalleryItem url', () => {
		test('GIVEN a media gallery item with a pre-defined url THEN return valid toJSON data', () => {
			const item = new MediaGalleryItemBuilder({ media: { url: 'https://google.com' } });
			expect(item.toJSON()).toEqual({ media: { url: 'https://google.com' } });
		});

		test('GIVEN a media gallery item with a set url THEN return valid toJSON data', () => {
			const item = new MediaGalleryItemBuilder().setURL('https://google.com');
			expect(item.toJSON()).toEqual({ media: { url: 'https://google.com' } });
		});

		test.each(['owo', 'discord://user'])(
			'GIVEN a media gallery item with an invalid URL (%s) THEN throws error',
			(input) => {
				const item = new MediaGalleryItemBuilder();

				item.setURL(input);
				expect(() => item.toJSON()).toThrowError();
			},
		);
	});

	describe('MediaGalleryItem description', () => {
		test('GIVEN a media gallery item with a pre-defined description THEN return valid toJSON data', () => {
			const item = new MediaGalleryItemBuilder({ ...dummy, description: 'foo' });
			expect(item.toJSON()).toEqual({ ...dummy, description: 'foo' });
		});

		test('GIVEN a media gallery item with a set description THEN return valid toJSON data', () => {
			const item = new MediaGalleryItemBuilder({ ...dummy });
			item.setDescription('foo');

			expect(item.toJSON()).toEqual({ ...dummy, description: 'foo' });
		});

		test('GIVEN a media gallery item with a pre-defined description THEN unset description THEN return valid toJSON data', () => {
			const item = new MediaGalleryItemBuilder({ description: 'foo', ...dummy });
			item.clearDescription();

			expect(item.toJSON()).toEqual({ ...dummy });
		});

		test('GIVEN a media gallery item with an invalid description THEN throws error', () => {
			const item = new MediaGalleryItemBuilder();

			item.setDescription('a'.repeat(1_025));
			expect(() => item.toJSON()).toThrowError();
		});
	});

	describe('MediaGalleryItem spoiler', () => {
		test('GIVEN a media gallery item with a pre-defined spoiler status THEN return valid toJSON data', () => {
			const item = new MediaGalleryItemBuilder({ ...dummy, spoiler: true });
			expect(item.toJSON()).toEqual({ ...dummy, spoiler: true });
		});

		test('GIVEN a media gallery item with a set spoiler status THEN return valid toJSON data', () => {
			const item = new MediaGalleryItemBuilder({ ...dummy });
			item.setSpoiler(false);

			expect(item.toJSON()).toEqual({ ...dummy, spoiler: false });
		});
	});
});
