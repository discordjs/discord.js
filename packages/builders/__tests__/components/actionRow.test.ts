import {
	ButtonStyle,
	ComponentType,
	type APIActionRowComponent,
	type APIMessageActionRowComponent,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	ActionRowBuilder,
	createComponentBuilder,
	PrimaryButtonBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from '../../src/index.js';

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
			type: ComponentType.StringSelect,
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
			max_values: 2,
			min_values: 2,
		},
	],
};

describe('Action Row Components', () => {
	describe('Assertion Tests', () => {
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
				],
			};

			expect(new ActionRowBuilder(actionRowData).toJSON()).toEqual(actionRowData);
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
						type: ComponentType.StringSelect,
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
						max_values: 1,
						min_values: 1,
					},
				],
			};

			expect(new ActionRowBuilder(rowWithButtonData).toJSON()).toEqual(rowWithButtonData);
			expect(new ActionRowBuilder(rowWithSelectMenuData).toJSON()).toEqual(rowWithSelectMenuData);
			expect(() => createComponentBuilder({ type: ComponentType.ActionRow, components: [] })).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given 2', () => {
			const button = new PrimaryButtonBuilder().setLabel('test').setCustomId('123');
			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId('1234')
				.setMaxValues(2)
				.setMinValues(2)
				.setOptions(
					new StringSelectMenuOptionBuilder().setLabel('one').setValue('one'),
					new StringSelectMenuOptionBuilder().setLabel('two').setValue('two'),
				)
				.setOptions([
					new StringSelectMenuOptionBuilder().setLabel('one').setValue('one'),
					new StringSelectMenuOptionBuilder().setLabel('two').setValue('two'),
				]);

			expect(new ActionRowBuilder().addPrimaryButtonComponents(button).toJSON()).toEqual(rowWithButtonData);
			expect(new ActionRowBuilder().addStringSelectMenuComponent(selectMenu).toJSON()).toEqual(rowWithSelectMenuData);
			expect(new ActionRowBuilder().addPrimaryButtonComponents([button]).toJSON()).toEqual(rowWithButtonData);
		});

		test('GIVEN 2 select menus THEN it throws', () => {
			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId('1234')
				.setOptions(
					new StringSelectMenuOptionBuilder().setLabel('one').setValue('one'),
					new StringSelectMenuOptionBuilder().setLabel('two').setValue('two'),
				);

			expect(() =>
				new ActionRowBuilder()
					.addStringSelectMenuComponent(selectMenu)
					.addStringSelectMenuComponent(selectMenu)
					.toJSON(),
			).toThrowError();
		});

		test('GIVEN a button and a select menu THEN it throws', () => {
			const button = new PrimaryButtonBuilder().setLabel('test').setCustomId('123');
			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId('1234')
				.setOptions(
					new StringSelectMenuOptionBuilder().setLabel('one').setValue('one'),
					new StringSelectMenuOptionBuilder().setLabel('two').setValue('two'),
				);

			expect(() =>
				new ActionRowBuilder().addStringSelectMenuComponent(selectMenu).addPrimaryButtonComponents(button).toJSON(),
			).toThrowError();
		});
	});
});
