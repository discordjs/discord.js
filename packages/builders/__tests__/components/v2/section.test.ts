import { type APISectionComponent, ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { createComponentBuilder } from '../../../src/components/Components.js';
import { ButtonBuilder } from '../../../src/components/button/Button.js';
import { SectionBuilder } from '../../../src/components/v2/Section.js';
import { TextDisplayBuilder } from '../../../src/components/v2/TextDisplay.js';
import { ThumbnailBuilder } from '../../../src/components/v2/Thumbnail.js';

const sectionWithButtonData: APISectionComponent = {
	type: ComponentType.Section,
	components: [
		{
			type: ComponentType.TextDisplay,
			content: 'test',
		},
	],
	accessory: {
		type: ComponentType.Button,
		label: 'test',
		custom_id: '123',
		style: ButtonStyle.Primary,
	},
};

const sectionWithThumbnailData: APISectionComponent = {
	type: ComponentType.Section,
	components: [
		{
			type: ComponentType.TextDisplay,
			content: 'test',
		},
	],
	accessory: {
		type: ComponentType.Thumbnail,
		media: { url: 'attachment://file.png' },
		spoiler: true,
		description: 'test',
	},
};

describe('Section Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid components THEN do not throw', () => {
			expect(() => new SectionBuilder().addTextDisplayComponents(new TextDisplayBuilder())).not.toThrowError();
			expect(() => new SectionBuilder().spliceTextDisplayComponents(0, 0, new TextDisplayBuilder())).not.toThrowError();
			expect(() => new SectionBuilder().addTextDisplayComponents([new TextDisplayBuilder()])).not.toThrowError();
			expect(() =>
				new SectionBuilder().spliceTextDisplayComponents(0, 0, [new TextDisplayBuilder()]),
			).not.toThrowError();
		});

		test('GIVEN valid JSON input THEN valid JSON output is given', () => {
			const sectionData: APISectionComponent = {
				type: ComponentType.Section,
				components: [
					{
						type: ComponentType.TextDisplay,
						content: 'test',
						id: 123,
					},
					{
						type: ComponentType.TextDisplay,
						content: 'test',
					},
					{
						type: ComponentType.TextDisplay,
						content: 'test',
					},
				],
				accessory: {
					type: ComponentType.Thumbnail,
					media: { url: 'attachment://file.png' },
				},
			};

			expect(new SectionBuilder(sectionData).toJSON()).toEqual(sectionData);
			expect(() =>
				createComponentBuilder({
					type: ComponentType.Section,
					components: [],
					accessory: { type: ComponentType.Thumbnail, media: { url: 'https://discord.com/logo.png' } },
				}),
			).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given', () => {
			const sectionWithButtonData: APISectionComponent = {
				type: ComponentType.Section,
				components: [
					{
						type: ComponentType.TextDisplay,
						content: 'test',
					},
				],
				accessory: {
					type: ComponentType.Button,
					label: 'test',
					custom_id: '123',
					style: ButtonStyle.Primary,
				},
			};

			const sectionWithThumbnailData: APISectionComponent = {
				type: ComponentType.Section,
				components: [
					{
						type: ComponentType.TextDisplay,
						content: 'test',
					},
				],
				accessory: {
					type: ComponentType.Thumbnail,
					media: { url: 'attachment://file.png' },
					spoiler: true,
					description: 'test',
				},
			};

			expect(new SectionBuilder(sectionWithButtonData).toJSON()).toEqual(sectionWithButtonData);
			expect(new SectionBuilder(sectionWithThumbnailData).toJSON()).toEqual(sectionWithThumbnailData);
			expect(() =>
				createComponentBuilder({
					type: ComponentType.Section,
					components: [],
					accessory: {
						type: ComponentType.Button,
						label: 'test',
						custom_id: '123',
						style: ButtonStyle.Primary,
					},
				}),
			).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given 2', () => {
			const button = new ButtonBuilder().setLabel('test').setStyle(ButtonStyle.Primary).setCustomId('123');
			const thumbnail = new ThumbnailBuilder().setDescription('test').setSpoiler().setURL('attachment://file.png');
			const textDisplay = new TextDisplayBuilder().setContent('test');

			expect(new SectionBuilder().addTextDisplayComponents(textDisplay).setButtonAccessory(button).toJSON()).toEqual(
				sectionWithButtonData,
			);
			expect(
				new SectionBuilder().addTextDisplayComponents(textDisplay).setThumbnailAccessory(thumbnail).toJSON(),
			).toEqual(sectionWithThumbnailData);
			expect(
				new SectionBuilder()
					.addTextDisplayComponents([textDisplay])
					.setButtonAccessory((button) => button.setLabel('test').setStyle(ButtonStyle.Primary).setCustomId('123'))
					.toJSON(),
			).toEqual(sectionWithButtonData);
			expect(
				new SectionBuilder()
					.addTextDisplayComponents([textDisplay])
					.setThumbnailAccessory((thumbnail) =>
						thumbnail.setDescription('test').setSpoiler().setURL('attachment://file.png'),
					)
					.toJSON(),
			).toEqual(sectionWithThumbnailData);
		});

		test('GIVEN valid builder callback THEN valid JSON output is given', () => {
			const button = new ButtonBuilder().setLabel('test').setStyle(ButtonStyle.Primary).setCustomId('123');

			expect(
				new SectionBuilder()
					.addTextDisplayComponents((textDisplay) => textDisplay.setContent('test'))
					.setButtonAccessory(button)
					.toJSON(),
			).toEqual(sectionWithButtonData);
			expect(
				new SectionBuilder()
					.spliceTextDisplayComponents(0, 0, (textDisplay) => textDisplay.setContent('test'))
					.setButtonAccessory(button)
					.toJSON(),
			).toEqual(sectionWithButtonData);
			expect(
				new SectionBuilder()
					.addTextDisplayComponents([(textDisplay) => textDisplay.setContent('test')])
					.setButtonAccessory(button)
					.toJSON(),
			).toEqual(sectionWithButtonData);
			expect(
				new SectionBuilder()
					.spliceTextDisplayComponents(0, 0, [(textDisplay) => textDisplay.setContent('test')])
					.setButtonAccessory(button)
					.toJSON(),
			).toEqual(sectionWithButtonData);
		});
	});
});
