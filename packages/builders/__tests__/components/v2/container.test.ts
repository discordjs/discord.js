import { type APIContainerComponent, ComponentType, SeparatorSpacingSize } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { createComponentBuilder } from '../../../src/components/Components.js';
import { ContainerBuilder } from '../../../src/components/v2/Container.js';
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
			expect(() => new ContainerBuilder().addComponents(new SeparatorBuilder())).not.toThrowError();
			expect(() => new ContainerBuilder().setComponents(new SeparatorBuilder())).not.toThrowError();
			expect(() => new ContainerBuilder().addComponents([new SeparatorBuilder()])).not.toThrowError();
			expect(() => new ContainerBuilder().setComponents([new SeparatorBuilder()])).not.toThrowError();
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
			expect(new ContainerBuilder().toJSON()).toEqual({ type: ComponentType.Container, components: [] });
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
			expect(new ContainerBuilder().toJSON()).toEqual({ type: ComponentType.Container, components: [] });
			expect(() => createComponentBuilder({ type: ComponentType.Container, components: [] })).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given 2', () => {
			const textDisplay = new TextDisplayBuilder().setContent('test').setId(123);
			const separator = new SeparatorBuilder().setId(1_234).setSpacing(SeparatorSpacingSize.Small).setDivider(false);

			expect(new ContainerBuilder().addComponents(textDisplay).toJSON()).toEqual(containerWithTextDisplay);
			expect(new ContainerBuilder().addComponents(separator).toJSON()).toEqual(containerWithSeparatorDataNoColor);
			expect(new ContainerBuilder().addComponents([textDisplay]).toJSON()).toEqual(containerWithTextDisplay);
			expect(new ContainerBuilder().addComponents([separator]).toJSON()).toEqual(containerWithSeparatorDataNoColor);
		});

		test('GIVEN valid accent color THEN valid JSON output is given', () => {
			expect(new ContainerBuilder().setAccentColor([255, 0, 255]).toJSON()).toEqual({
				type: ComponentType.Container,
				components: [],
				accent_color: 0xff00ff,
			});
			expect(new ContainerBuilder().setAccentColor(0xff00ff).toJSON()).toEqual({
				type: ComponentType.Container,
				components: [],
				accent_color: 0xff00ff,
			});
			expect(new ContainerBuilder().setAccentColor([255, 0, 255]).setAccentColor(null).toJSON()).toEqual({
				type: ComponentType.Container,
				components: [],
			});
			expect(new ContainerBuilder(containerWithSeparatorData).setAccentColor(null).toJSON()).toEqual(
				containerWithSeparatorDataNoColor,
			);
		});

		test('GIVEN valid method parameters THEN valid JSON is given', () => {
			expect(new ContainerBuilder().setSpoiler().toJSON()).toEqual({
				type: ComponentType.Container,
				components: [],
				spoiler: true,
			});
			expect(new ContainerBuilder().setSpoiler(false).setId(5).toJSON()).toEqual({
				type: ComponentType.Container,
				components: [],
				spoiler: false,
				id: 5,
			});
		});
	});
});
