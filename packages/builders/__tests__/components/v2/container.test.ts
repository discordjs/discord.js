import { type APIContainerComponent, ComponentType, SeparatorSpacingSize } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { ActionRowBuilder } from '../../../src/components/ActionRow.js';
import { createComponentBuilder } from '../../../src/components/Components.js';
import { ButtonBuilder } from '../../../src/components/button/Button.js';
import { ContainerBuilder } from '../../../src/components/v2/Container.js';
import { FileBuilder } from '../../../src/components/v2/File.js';
import { MediaGalleryBuilder } from '../../../src/components/v2/MediaGallery.js';
import { SectionBuilder } from '../../../src/components/v2/Section.js';
import { SeparatorBuilder } from '../../../src/components/v2/Separator.js';
import { TextDisplayBuilder } from '../../../src/components/v2/TextDisplay.js';

const containerWithTextDisplay: APIContainerComponent = {
	type: ComponentType.Container,
	components: [
		{
			type: ComponentType.TextDisplay,
			content: 'test',
			id: 123,
		},
	],
};

const containerWithSeparatorData: APIContainerComponent = {
	type: ComponentType.Container,
	components: [
		{
			type: ComponentType.Separator,
			id: 1_234,
			spacing: SeparatorSpacingSize.Small,
			divider: false,
		},
	],
	accent_color: 0x00ff00,
};

const containerWithSeparatorDataNoColor: APIContainerComponent = {
	type: ComponentType.Container,
	components: [
		{
			type: ComponentType.Separator,
			id: 1_234,
			spacing: SeparatorSpacingSize.Small,
			divider: false,
		},
	],
};

describe('Container Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid components THEN do not throw', () => {
			expect(() =>
				new ContainerBuilder().addActionRowComponents(
					new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder()),
				),
			).not.toThrowError();
			expect(() => new ContainerBuilder().addFileComponents(new FileBuilder())).not.toThrowError();
			expect(() => new ContainerBuilder().addMediaGalleryComponents(new MediaGalleryBuilder())).not.toThrowError();
			expect(() => new ContainerBuilder().addSectionComponents(new SectionBuilder())).not.toThrowError();
			expect(() => new ContainerBuilder().addSeparatorComponents(new SeparatorBuilder())).not.toThrowError();
			expect(() => new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder())).not.toThrowError();
			expect(() => new ContainerBuilder().spliceComponents(0, 0, new SeparatorBuilder())).not.toThrowError();
			expect(() => new ContainerBuilder().addSeparatorComponents([new SeparatorBuilder()])).not.toThrowError();
			expect(() =>
				new ContainerBuilder().spliceComponents(0, 0, [{ type: ComponentType.Separator }]),
			).not.toThrowError();
		});

		test('GIVEN valid JSON input THEN valid JSON output is given', () => {
			const containerData: APIContainerComponent = {
				type: ComponentType.Container,
				components: [
					{
						type: ComponentType.TextDisplay,
						content: 'test',
						id: 3,
					},
					{
						type: ComponentType.Separator,
						spacing: SeparatorSpacingSize.Large,
						divider: true,
						id: 4,
					},
					{
						type: ComponentType.File,
						file: {
							url: 'attachment://file.png',
						},
						spoiler: false,
					},
				],
				accent_color: 0xff00ff,
				spoiler: true,
			};

			expect(new ContainerBuilder(containerData).toJSON()).toEqual(containerData);
			expect(() => createComponentBuilder({ type: ComponentType.Container, components: [] })).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given', () => {
			const containerWithTextDisplay: APIContainerComponent = {
				type: ComponentType.Container,
				components: [
					{
						type: ComponentType.TextDisplay,
						content: 'test',
						id: 123,
					},
				],
			};

			const containerWithSeparatorData: APIContainerComponent = {
				type: ComponentType.Container,
				components: [
					{
						type: ComponentType.Separator,
						id: 1_234,
						spacing: SeparatorSpacingSize.Small,
						divider: false,
					},
				],
				accent_color: 0x00ff00,
			};

			expect(new ContainerBuilder(containerWithTextDisplay).toJSON()).toEqual(containerWithTextDisplay);
			expect(new ContainerBuilder(containerWithSeparatorData).toJSON()).toEqual(containerWithSeparatorData);
			expect(() => createComponentBuilder({ type: ComponentType.Container, components: [] })).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given 2', () => {
			const textDisplay = new TextDisplayBuilder().setContent('test').setId(123);
			const separator = new SeparatorBuilder().setId(1_234).setSpacing(SeparatorSpacingSize.Small).setDivider(false);

			expect(new ContainerBuilder().addTextDisplayComponents(textDisplay).toJSON()).toEqual(containerWithTextDisplay);
			expect(new ContainerBuilder().addSeparatorComponents(separator).toJSON()).toEqual(
				containerWithSeparatorDataNoColor,
			);
			expect(new ContainerBuilder().addTextDisplayComponents([textDisplay]).toJSON()).toEqual(containerWithTextDisplay);
			expect(new ContainerBuilder().addSeparatorComponents([separator]).toJSON()).toEqual(
				containerWithSeparatorDataNoColor,
			);
		});

		test('GIVEN valid accent color THEN valid JSON output is given', () => {
			expect(
				new ContainerBuilder({
					components: [
						{
							type: ComponentType.TextDisplay,
							content: 'test',
						},
					],
				})
					.setAccentColor([255, 0, 255])
					.toJSON(),
			).toEqual({
				type: ComponentType.Container,
				components: [
					{
						type: ComponentType.TextDisplay,
						content: 'test',
					},
				],
				accent_color: 0xff00ff,
			});
			expect(
				new ContainerBuilder({
					components: [
						{
							type: ComponentType.TextDisplay,
							content: 'test',
						},
					],
				})
					.setAccentColor(0xff00ff)
					.toJSON(),
			).toEqual({
				type: ComponentType.Container,
				components: [
					{
						type: ComponentType.TextDisplay,
						content: 'test',
					},
				],
				accent_color: 0xff00ff,
			});
			expect(
				new ContainerBuilder({
					components: [
						{
							type: ComponentType.TextDisplay,
							content: 'test',
						},
					],
				})
					.setAccentColor([255, 0, 255])
					.clearAccentColor()
					.toJSON(),
			).toEqual({
				type: ComponentType.Container,
				components: [
					{
						type: ComponentType.TextDisplay,
						content: 'test',
					},
				],
			});
			expect(new ContainerBuilder(containerWithSeparatorData).clearAccentColor().toJSON()).toEqual(
				containerWithSeparatorDataNoColor,
			);
		});

		test('GIVEN valid method parameters THEN valid JSON is given', () => {
			expect(
				new ContainerBuilder()
					.addTextDisplayComponents(new TextDisplayBuilder().setId(3).clearId().setContent('test'))
					.setSpoiler()
					.toJSON(),
			).toEqual({
				type: ComponentType.Container,
				components: [
					{
						type: ComponentType.TextDisplay,
						content: 'test',
					},
				],
				spoiler: true,
			});
			expect(
				new ContainerBuilder()
					.addTextDisplayComponents({ type: ComponentType.TextDisplay, content: 'test' })
					.setSpoiler(false)
					.setId(5)
					.toJSON(),
			).toEqual({
				type: ComponentType.Container,
				components: [
					{
						type: ComponentType.TextDisplay,
						content: 'test',
					},
				],
				spoiler: false,
				id: 5,
			});
		});
	});
});
