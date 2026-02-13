import {
	EmbedType,
	type APIEmbed,
	type APIEmbedAuthor,
	type APIEmbedField,
	type APIEmbedFooter,
	type APIEmbedImage,
	type APIEmbedProvider,
	type APIEmbedThumbnail,
	type APIEmbedVideo,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	Embed,
	EmbedVideo,
	EmbedThumbnail,
	EmbedProvider,
	EmbedImage,
	EmbedFooter,
	EmbedField,
	EmbedAuthor,
} from '../src/index.js';
import { kPatch } from '../src/utils/symbols.js';

/**
 * for kPatch, set url and add iconURL
 */
const author: APIEmbedAuthor = {
	name: 'djs://embed-author-data-name',
	url: 'djs://embed-author-data-url',
};

/**
 * for kPatch, set inline and update value
 */
const fields: APIEmbedField[] = [
	{
		name: 'djs://embed-field-data-name',
		value: 'djs://embed-field-data-value',
	},
];

/**
 * for kPatch, update iconURL and set 'proxy'
 */
const footer: APIEmbedFooter = {
	text: 'djs://embed-footer-data-text',
	icon_url: 'embed-footer-data-icon-url',
};

/**
 * for kPatch, add proxyURL and height/width
 */
const image: APIEmbedImage = {
	url: 'djs://embed-image-data-url',
	height: 1,
	width: 2,
};

/**
 * for kPatch, update name and remove url
 */
const provider: APIEmbedProvider = {
	name: 'djs://embed-provider-data-name',
	url: 'embed-provider-data-url',
};

/**
 * add proxyURL and update h/w
 */
const thumbnail: APIEmbedThumbnail = {
	url: 'djs://embed-thumbnail-data-url',
	height: 1,
	width: 2,
};

/**
 * for kPatch, set proxy and update h/w
 */
const video: APIEmbedVideo = {
	url: 'djs://embed-video-data-url',
	height: 1,
	width: 2,
};

/**
 * for kPatch, add fields
 */
const data: APIEmbed[] = [
	{
		title: 'djs://embed-title',
		type: EmbedType.Rich,
		description: 'djs://embed-description',
		color: 0x676767,
		timestamp: '2020-10-10T13:50:17.209000+00:00',
		footer,
		image,
		thumbnail,
		video,
		provider,
		author,
		fields,
	},
];

const embeds = data.map((x) => new Embed(x));

describe('embed structure', () => {
	const embedData = data[0]!;
	const instance = embeds[0]!;

	test('correct values for all getters and helper method [hexColor]', () => {
		expect(instance.color).toBe(embedData.color);
		expect(instance.description).toBe(embedData.description);
		expect(instance.type).toBe(embedData.type);

		/* * @todo - there is no timestampDate getter on Embed. Is this intentional? */
		expect(instance.timestamp).toBe(new Date(embedData.timestamp!).getTime());
		expect(instance.hexColor).toEqual(`#${embedData.color!.toString(16)}`);
	});

	test('toJSON() returns expected values', () => {
		expect(instance.toJSON()).toStrictEqual(embedData);
	});

	test('patching the structure works in-place', () => {
		const patched = instance[kPatch]({
			title: 'djs://[PATCHED]-embed-title',
			url: '[PATCHED]-embed-url',
		});

		expect(patched.title).toBe('djs://[PATCHED]-embed-title');
		expect(patched.url).toBe('[PATCHED]-embed-url');

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});

	describe('embed video sub-structure', () => {
		const data = video;
		const instance = new EmbedVideo(video);

		test('correct values for all getters', () => {
			expect(instance.url).toBe(data.url);
			expect(instance.height).toBe(data.height);
			expect(instance.width).toBe(data.width);

			expect(instance.proxyURL).toBeUndefined();
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				proxy_url: 'djs://[PATCHED]-embed-video-proxy-url',
				height: 2,
				width: 22,
			});

			expect(patched.proxyURL).toEqual('djs://[PATCHED]-embed-video-proxy-url');
			expect(patched.height).toEqual(2);
			expect(patched.width).toEqual(22);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('embed thumbnail sub-structure', () => {
		const data = thumbnail;
		const instance = new EmbedThumbnail(thumbnail);

		test('correct values for all getters', () => {
			expect(instance.url).toBe(data.url);
			expect(instance.height).toBe(data.height);
			expect(instance.width).toBe(data.width);

			expect(instance.proxyURL).toBeUndefined();
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				proxy_url: 'djs://[PATCHED]-embed-thumbnail-proxy-url',
				height: 22,
				width: 33,
			});

			expect(patched.proxyURL).toEqual('djs://[PATCHED]-embed-thumbnail-proxy-url');
			expect(patched.height).toEqual(22);
			expect(patched.width).toEqual(33);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('embed provider sub-structure', () => {
		const data = provider;
		const instance = new EmbedProvider(data);

		test('correct values for all getters', () => {
			expect(instance.name).toBe(data.name);
			expect(instance.url).toBe(data.url);
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				name: 'djs://[PATCHED]-embed-provider-name',
			});

			expect(patched.name).toEqual('djs://[PATCHED]-embed-provider-name');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('embed image sub-structure', () => {
		const data = image;
		const instance = new EmbedImage(image);

		test('correct values for all getters', () => {
			expect(instance.url).toBe(data.url);
			expect(instance.height).toBe(data.height);
			expect(instance.width).toBe(data.width);

			expect(instance.proxyURL).toBeUndefined();
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				proxy_url: 'djs://[PATCHED]-embed-thumbnail-proxy-url',
				height: 22,
				width: 33,
			});

			expect(patched.proxyURL).toEqual('djs://[PATCHED]-embed-thumbnail-proxy-url');
			expect(patched.height).toEqual(22);
			expect(patched.width).toEqual(33);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('embed footer sub-structure', () => {
		const data = footer;
		const instance = new EmbedFooter(footer);

		test('correct values for all getters', () => {
			expect(instance.text).toBe(data.text);
			expect(instance.iconURL).toBe(data.icon_url);

			expect(instance.proxyIconURL).toBeUndefined();
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				icon_url: 'djs://[PATCHED]-embed-footer-icon-url',
			});

			expect(patched.iconURL).toEqual('djs://[PATCHED]-embed-footer-icon-url');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('embed field sub-structure', () => {
		const data = fields[0]!;
		const instance = new EmbedField(data)!;

		test('correct values for all getters', () => {
			expect(instance.name).toBe(data.name);
			expect(instance.value).toBe(data.value);

			expect(instance.inline).toBeUndefined();
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				value: 'djs://[PATCHED]-embed-field-value',
				inline: true,
			});

			expect(patched.value).toEqual('djs://[PATCHED]-embed-field-value');
			expect(patched.inline).toEqual(true);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('embed author sub-structure', () => {
		const data = author;
		const instance = new EmbedAuthor(data);

		test('correct values for all getters', () => {
			expect(instance.name).toBe(data.name);
			expect(instance.url).toBe(data.url);

			expect(instance.iconURL).toBeUndefined();
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				name: 'djs://[PATCHED]-embed-author-name',
				proxy_icon_url: '[PATCHED]-embed-author-proxy-icon-url',
			});

			expect(patched.name).toBe('djs://[PATCHED]-embed-author-name');
			expect(patched.proxyIconURL).toEqual('[PATCHED]-embed-author-proxy-icon-url');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});
});
