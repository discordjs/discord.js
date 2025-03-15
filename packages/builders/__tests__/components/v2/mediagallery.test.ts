import { type APIMediaGalleryItem, type APIMediaGalleryComponent, ComponentType } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { createComponentBuilder } from '../../../src/components/Components.js';
import { MediaGalleryBuilder } from '../../../src/components/v2/MediaGallery.js';
import { MediaGalleryItemBuilder } from '../../../src/components/v2/MediaGalleryItem.js';

const galleryHttpsDisplay: APIMediaGalleryComponent = {
	type: ComponentType.MediaGallery,
	items: [
		{
			description: 'test',
			spoiler: false,
			media: { url: 'https://discord.com/logo.png' },
		},
	],
};

const galleryAttachmentData: APIMediaGalleryComponent = {
	type: ComponentType.MediaGallery,
	items: [
		{
			media: { url: 'attachment://file.png' },
		},
	],
	id: 123,
};

describe('Media Gallery Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN an empty media gallery THEN throws error', () => {
			const gallery = new MediaGalleryBuilder();
			expect(() => gallery.toJSON()).toThrow();
		});

		test('GIVEN valid items THEN do not throw', () => {
			expect(() => new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder())).not.toThrowError();
			expect(() => new MediaGalleryBuilder().spliceItems(0, 0, new MediaGalleryItemBuilder())).not.toThrowError();
			expect(() => new MediaGalleryBuilder().addItems([new MediaGalleryItemBuilder()])).not.toThrowError();
			expect(() => new MediaGalleryBuilder().spliceItems(0, 0, [new MediaGalleryItemBuilder()])).not.toThrowError();
		});

		test('GIVEN valid JSON input THEN valid JSON output is given', () => {
			const mediaGalleryData: APIMediaGalleryComponent = {
				type: ComponentType.MediaGallery,
				items: [
					{
						media: { url: 'attachment://file.png' },
						description: 'test',
						spoiler: false,
					},
					{
						media: { url: 'https://discord.js.org/logo.jpg' },
						spoiler: true,
					},
				],
				id: 1_234,
			};

			expect(new MediaGalleryBuilder(mediaGalleryData).toJSON()).toEqual(mediaGalleryData);
			expect(() => createComponentBuilder({ type: ComponentType.MediaGallery, items: [] })).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given', () => {
			const galleryHttpsDisplay: APIMediaGalleryComponent = {
				type: ComponentType.MediaGallery,
				items: [
					{
						description: 'test',
						spoiler: false,
						media: { url: 'https://discord.com/logo.png' },
					},
				],
			};

			const galleryAttachmentData: APIMediaGalleryComponent = {
				type: ComponentType.MediaGallery,
				items: [
					{
						media: { url: 'attachment://file.png' },
					},
				],
				id: 123,
			};

			expect(new MediaGalleryBuilder(galleryHttpsDisplay).toJSON()).toEqual(galleryHttpsDisplay);
			expect(new MediaGalleryBuilder(galleryAttachmentData).toJSON()).toEqual(galleryAttachmentData);
			expect(() => createComponentBuilder({ type: ComponentType.MediaGallery, items: [] })).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given 2', () => {
			const item1 = new MediaGalleryItemBuilder()
				.setDescription('test')
				.setSpoiler(false)
				.setURL('https://discord.com/logo.png');
			const item2 = new MediaGalleryItemBuilder().setURL('attachment://file.png');

			expect(new MediaGalleryBuilder().addItems(item1).toJSON()).toEqual(galleryHttpsDisplay);
			expect(new MediaGalleryBuilder().addItems(item2).setId(123).toJSON()).toEqual(galleryAttachmentData);
			expect(new MediaGalleryBuilder().addItems([item1]).toJSON()).toEqual(galleryHttpsDisplay);
			expect(new MediaGalleryBuilder().addItems([item2]).setId(123).toJSON()).toEqual(galleryAttachmentData);
		});

		test('GIVEN valid JSON options THEN valid JSON output is given 2', () => {
			const item1: APIMediaGalleryItem = {
				description: 'test',
				spoiler: false,
				media: { url: 'https://discord.com/logo.png' },
			};
			const item2 = {
				media: { url: 'attachment://file.png' },
			};

			expect(new MediaGalleryBuilder().addItems(item1).toJSON()).toEqual(galleryHttpsDisplay);
			expect(new MediaGalleryBuilder().addItems(item2).setId(123).toJSON()).toEqual(galleryAttachmentData);
			expect(new MediaGalleryBuilder().addItems([item1]).toJSON()).toEqual(galleryHttpsDisplay);
			expect(new MediaGalleryBuilder().addItems([item2]).setId(123).toJSON()).toEqual(galleryAttachmentData);
		});

		test('GIVEN valid builder callback THEN valid JSON output is given', () => {
			const item1 = new MediaGalleryItemBuilder()
				.setDescription('test')
				.setSpoiler(false)
				.setURL('https://discord.com/logo.png');
			const item2 = new MediaGalleryItemBuilder().setURL('attachment://file.png');

			expect(
				new MediaGalleryBuilder()
					.addItems((item) => item.setDescription('test').setSpoiler(false).setURL('https://discord.com/logo.png'))
					.toJSON(),
			).toEqual(galleryHttpsDisplay);
			expect(
				new MediaGalleryBuilder()
					.spliceItems(0, 0, (item) => item.setURL('attachment://file.png'))
					.setId(123)
					.toJSON(),
			).toEqual(galleryAttachmentData);
			expect(
				new MediaGalleryBuilder()
					.addItems([(item) => item.setDescription('test').setSpoiler(false).setURL('https://discord.com/logo.png')])
					.toJSON(),
			).toEqual(galleryHttpsDisplay);
			expect(
				new MediaGalleryBuilder()
					.spliceItems(0, 0, [(item) => item.setDescription('test').clearDescription().setURL('attachment://file.png')])
					.setId(123)
					.toJSON(),
			).toEqual(galleryAttachmentData);
		});
	});
});
