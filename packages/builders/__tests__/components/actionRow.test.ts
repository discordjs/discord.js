import { APIActionRowComponent, APIMessageActionRowComponent, ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	ActionRowBuilder,
	ButtonBuilder,
	createComponentBuilder,
	SelectMenuBuilder,
	SelectMenuOptionBuilder,
} from '../../src';

const rowWithButtonData: APIActionRowComponent<APIMessageActionRowComponent> = {
	type: ComponentType.ActionRow,
	components: [
		{
			type: ComponentType.Button,
			label: 'test',
			custom_id: '123',
			style: ButtonStyle.Primary,
		},
	],
};

const rowWithSelectMenuData: APIActionRowComponent<APIMessageActionRowComponent> = {
	type: ComponentType.ActionRow,
	components: [
		{
			type: ComponentType.SelectMenu,
			custom_id: '1234',
			options: [
				{
					label: 'one',
					value: 'one',
				},
				{
					label: 'two',
					value: 'two',
				},
			],
			max_values: 10,
			min_values: 12,
		},
	],
};

describe('Action Row Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid components THEN do not throw', () => {
			expect(() => new ActionRowBuilder().addComponents(new ButtonBuilder())).not.toThrowError();
			expect(() => new ActionRowBuilder().setComponents(new ButtonBuilder())).not.toThrowError();
			expect(() => new ActionRowBuilder().addComponents([new ButtonBuilder()])).not.toThrowError();
			expect(() => new ActionRowBuilder().setComponents([new ButtonBuilder()])).not.toThrowError();
		});

		test('GIVEN valid JSON input THEN valid JSON output is given', () => {
			const actionRowData: APIActionRowComponent<APIMessageActionRowComponent> = {
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						label: 'button',
						style: ButtonStyle.Primary,
						custom_id: 'test',
					},
					{
						type: ComponentType.Button,
						label: 'link',
						style: ButtonStyle.Link,
						url: 'https://google.com',
					},
					{
						type: ComponentType.SelectMenu,
						placeholder: 'test',
						custom_id: 'test',
						options: [
							{
								label: 'option',
								value: 'option',
							},
						],
					},
				],
			};

			expect(new ActionRowBuilder(actionRowData).toJSON()).toEqual(actionRowData);
			expect(new ActionRowBuilder().toJSON()).toEqual({ type: ComponentType.ActionRow, components: [] });
			expect(() => createComponentBuilder({ type: ComponentType.ActionRow, components: [] })).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given', () => {
			const rowWithButtonData: APIActionRowComponent<APIMessageActionRowComponent> = {
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						label: 'test',
						custom_id: '123',
						style: ButtonStyle.Primary,
					},
				],
			};

			const rowWithSelectMenuData: APIActionRowComponent<APIMessageActionRowComponent> = {
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.SelectMenu,
						custom_id: '1234',
						options: [
							{
								label: 'one',
								value: 'one',
							},
							{
								label: 'two',
								value: 'two',
							},
						],
						max_values: 10,
						min_values: 12,
					},
				],
			};

			expect(new ActionRowBuilder(rowWithButtonData).toJSON()).toEqual(rowWithButtonData);
			expect(new ActionRowBuilder(rowWithSelectMenuData).toJSON()).toEqual(rowWithSelectMenuData);
			expect(new ActionRowBuilder().toJSON()).toEqual({ type: ComponentType.ActionRow, components: [] });
			expect(() => createComponentBuilder({ type: ComponentType.ActionRow, components: [] })).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given 2', () => {
			const button = new ButtonBuilder().setLabel('test').setStyle(ButtonStyle.Primary).setCustomId('123');
			const selectMenu = new SelectMenuBuilder()
				.setCustomId('1234')
				.setMaxValues(10)
				.setMinValues(12)
				.setOptions(
					new SelectMenuOptionBuilder().setLabel('one').setValue('one'),
					new SelectMenuOptionBuilder().setLabel('two').setValue('two'),
				)
				.setOptions([
					new SelectMenuOptionBuilder().setLabel('one').setValue('one'),
					new SelectMenuOptionBuilder().setLabel('two').setValue('two'),
				]);

			expect(new ActionRowBuilder().addComponents(button).toJSON()).toEqual(rowWithButtonData);
			expect(new ActionRowBuilder().addComponents(selectMenu).toJSON()).toEqual(rowWithSelectMenuData);
			expect(new ActionRowBuilder().addComponents([button]).toJSON()).toEqual(rowWithButtonData);
			expect(new ActionRowBuilder().addComponents([selectMenu]).toJSON()).toEqual(rowWithSelectMenuData);
		});
	});
});
