import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { PrimaryButtonBuilder } from '../../../src/components/button/CustomIdButton';
import { SectionBuilder } from '../../../src/components/v2/Section';
import { TextDisplayBuilder } from '../../../src/components/v2/TextDisplay';
import { ThumbnailBuilder } from '../../../src/components/v2/Thumbnail';

describe('Section', () => {
	describe('Validation', () => {
		test('GIVEN empty section builder THEN throws error on toJSON', () => {
			const section = new SectionBuilder();
			expect(() => section.toJSON()).toThrowError();
		});

		test('GIVEN section with text components but no accessory THEN throws error on toJSON', () => {
			const section = new SectionBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent('Hello world'));
			expect(() => section.toJSON()).toThrowError();
		});

		test('GIVEN section with accessory but no text components THEN throws error on toJSON', () => {
			const section = new SectionBuilder().setThumbnailAccessory(
				new ThumbnailBuilder().setURL('https://example.com/image.png'),
			);
			expect(() => section.toJSON()).toThrowError();
		});
	});

	describe('Text display components', () => {
		test('GIVEN section with predefined text components THEN returns valid toJSON data', () => {
			const section = new SectionBuilder({
				components: [{ type: ComponentType.TextDisplay, content: 'Hello world' }],
				accessory: { type: ComponentType.Thumbnail, media: { url: 'https://example.com/image.png' } },
			});

			expect(section.toJSON()).toEqual({
				type: ComponentType.Section,
				components: [{ type: ComponentType.TextDisplay, content: 'Hello world' }],
				accessory: { type: ComponentType.Thumbnail, media: { url: 'https://example.com/image.png' } },
			});
		});

		test('GIVEN section with added text components THEN returns valid toJSON data', () => {
			const section = new SectionBuilder()
				.addTextDisplayComponents(new TextDisplayBuilder().setContent('Hello world'))
				.setThumbnailAccessory(new ThumbnailBuilder().setURL('https://example.com/image.png'));

			expect(section.toJSON()).toEqual({
				type: ComponentType.Section,
				components: [{ type: ComponentType.TextDisplay, content: 'Hello world' }],
				accessory: { type: ComponentType.Thumbnail, media: { url: 'https://example.com/image.png' } },
			});
		});

		test('GIVEN section with multiple text components THEN returns valid toJSON data', () => {
			const section = new SectionBuilder()
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent('Line 1'),
					new TextDisplayBuilder().setContent('Line 2'),
					new TextDisplayBuilder().setContent('Line 3'),
				)
				.setThumbnailAccessory(new ThumbnailBuilder().setURL('https://example.com/image.png'));

			expect(section.toJSON()).toEqual({
				type: ComponentType.Section,
				components: [
					{ type: ComponentType.TextDisplay, content: 'Line 1' },
					{ type: ComponentType.TextDisplay, content: 'Line 2' },
					{ type: ComponentType.TextDisplay, content: 'Line 3' },
				],
				accessory: { type: ComponentType.Thumbnail, media: { url: 'https://example.com/image.png' } },
			});
		});

		test('GIVEN section with spliced text components THEN returns valid toJSON data', () => {
			const section = new SectionBuilder()
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent('Original 1'),
					new TextDisplayBuilder().setContent('Will be removed'),
					new TextDisplayBuilder().setContent('Original 3'),
				)
				.spliceTextDisplayComponents(1, 1, new TextDisplayBuilder().setContent('Replacement'))
				.setThumbnailAccessory(new ThumbnailBuilder().setURL('https://example.com/image.png'));

			expect(section.toJSON()).toEqual({
				type: ComponentType.Section,
				components: [
					{ type: ComponentType.TextDisplay, content: 'Original 1' },
					{ type: ComponentType.TextDisplay, content: 'Replacement' },
					{ type: ComponentType.TextDisplay, content: 'Original 3' },
				],
				accessory: { type: ComponentType.Thumbnail, media: { url: 'https://example.com/image.png' } },
			});
		});
	});

	describe('Accessory components', () => {
		test('GIVEN section with thumbnail accessory THEN returns valid toJSON data', () => {
			const section = new SectionBuilder()
				.addTextDisplayComponents(new TextDisplayBuilder().setContent('Hello world'))
				.setThumbnailAccessory(new ThumbnailBuilder().setURL('https://example.com/image.png'));

			expect(section.toJSON()).toEqual({
				type: ComponentType.Section,
				components: [{ type: ComponentType.TextDisplay, content: 'Hello world' }],
				accessory: { type: ComponentType.Thumbnail, media: { url: 'https://example.com/image.png' } },
			});
		});

		test('GIVEN section with primary button accessory THEN returns valid toJSON data', () => {
			const section = new SectionBuilder()
				.addTextDisplayComponents(new TextDisplayBuilder().setContent('Hello world'))
				.setPrimaryButtonAccessory(new PrimaryButtonBuilder().setCustomId('click_me').setLabel('Click me'));

			expect(section.toJSON()).toEqual({
				type: ComponentType.Section,
				components: [{ type: ComponentType.TextDisplay, content: 'Hello world' }],
				accessory: {
					type: ComponentType.Button,
					style: 1,
					custom_id: 'click_me',
					label: 'Click me',
				},
			});
		});

		test('GIVEN section with primary button accessory JSON THEN returns valid toJSON data', () => {
			const section = new SectionBuilder()
				.addTextDisplayComponents(new TextDisplayBuilder().setContent('Hello world'))
				.setPrimaryButtonAccessory({
					type: ComponentType.Button,
					style: ButtonStyle.Primary,
					custom_id: 'click_me',
					label: 'Click me',
				});

			expect(section.toJSON()).toEqual({
				type: ComponentType.Section,
				components: [{ type: ComponentType.TextDisplay, content: 'Hello world' }],
				accessory: {
					type: ComponentType.Button,
					style: 1,
					custom_id: 'click_me',
					label: 'Click me',
				},
			});
		});

		test('GIVEN changing accessory type THEN returns the latest accessory in toJSON', () => {
			const section = new SectionBuilder()
				.addTextDisplayComponents(new TextDisplayBuilder().setContent('Hello world'))
				.setThumbnailAccessory(new ThumbnailBuilder().setURL('https://example.com/image.png'))
				.setPrimaryButtonAccessory(new PrimaryButtonBuilder().setCustomId('click_me').setLabel('Click me'));

			expect(section.toJSON()).toEqual({
				type: ComponentType.Section,
				components: [{ type: ComponentType.TextDisplay, content: 'Hello world' }],
				accessory: {
					type: ComponentType.Button,
					style: 1,
					custom_id: 'click_me',
					label: 'Click me',
				},
			});
		});
	});
});
