import {
	type APIActionRowComponent,
	type APIButtonComponent,
	type APIContainerComponent,
	ButtonStyle,
	ComponentType,
	SeparatorSpacingSize,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { createComponentBuilder } from '../../../src/components/Components.js';
import { ContainerBuilder } from '../../../src/components/v2/Container.js';
import { SeparatorBuilder } from '../../../src/components/v2/Separator.js';
import { TextDisplayBuilder } from '../../../src/components/v2/TextDisplay.js';
import { MediaGalleryBuilder, SectionBuilder } from '../../../src/index.js';

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

const button = {
	type: ComponentType.Button as const,
	style: ButtonStyle.Primary as const,
	custom_id: 'test',
	label: 'test',
};

const actionRow: APIActionRowComponent<APIButtonComponent> = {
	type: ComponentType.ActionRow,
	components: [button],
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
			expect(() => new ContainerBuilder().addSeparatorComponents(new SeparatorBuilder()).toJSON()).not.toThrowError();
			expect(() => new ContainerBuilder().spliceComponents(0, 0, new SeparatorBuilder()).toJSON()).not.toThrowError();
			expect(() => new ContainerBuilder().addSeparatorComponents([new SeparatorBuilder()]).toJSON()).not.toThrowError();
			expect(() =>
				new ContainerBuilder().spliceComponents(0, 0, [{ type: ComponentType.Separator }]).toJSON(),
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
			expect(new ContainerBuilder(containerWithSeparatorData).clearAccentColor().toJSON()).toEqual(
				containerWithSeparatorDataNoColor,
			);
		});

		test('GIVEN valid method parameters THEN valid JSON is given', () => {
			expect(
				new ContainerBuilder()
					.addMediaGalleryComponents(
						new MediaGalleryBuilder()
							.addItems({ media: { url: 'https://discord.com' } })
							.setId(3)
							.clearId(),
					)
					.setSpoiler()
					.toJSON(),
			).toEqual({
				type: ComponentType.Container,
				components: [
					{
						type: ComponentType.MediaGallery,
						items: [{ media: { url: 'https://discord.com' } }],
					},
				],
				spoiler: true,
			});
			expect(
				new ContainerBuilder()
					.addSectionComponents(
						new SectionBuilder()
							.addTextDisplayComponents({ type: ComponentType.TextDisplay, content: 'test' })
							.setPrimaryButtonAccessory(button),
					)
					.addFileComponents({ type: ComponentType.File, file: { url: 'attachment://discord.png' } })
					.setSpoiler(false)
					.setId(5)
					.toJSON(),
			).toEqual({
				type: ComponentType.Container,
				components: [
					{
						type: ComponentType.Section,
						components: [
							{
								type: ComponentType.TextDisplay,
								content: 'test',
							},
						],
						accessory: button,
					},
					{
						type: ComponentType.File,
						file: { url: 'attachment://discord.png' },
					},
				],
				spoiler: false,
				id: 5,
			});
			expect(new ContainerBuilder().addActionRowComponents(actionRow).setSpoiler(true).toJSON()).toEqual({
				type: ComponentType.Container,
				components: [actionRow],
				spoiler: true,
			});
		});
	});
});
