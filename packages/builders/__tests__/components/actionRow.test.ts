import { APIActionRowComponent, APIMessageComponent, ButtonStyle, ComponentType } from 'discord-api-types/v9';
import { ActionRow, ButtonComponent, createComponent, SelectMenuComponent, SelectMenuOption } from '../../src';

describe('Action Row Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid components THEN do not throw', () => {
			expect(() => new ActionRow().addComponents(new ButtonComponent())).not.toThrowError();
			expect(() => new ActionRow().setComponents([new ButtonComponent()])).not.toThrowError();
		});

		test('GIVEN valid JSON input THEN valid JSON output is given', () => {
			const actionRowData: APIActionRowComponent<APIMessageComponent> = {
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

			expect(new ActionRow(actionRowData).toJSON()).toEqual(actionRowData);
			expect(new ActionRow().toJSON()).toEqual({ type: ComponentType.ActionRow, components: [] });
			expect(() => createComponent({ type: ComponentType.ActionRow, components: [] })).not.toThrowError();
			// @ts-expect-error
			expect(() => createComponent({ type: 42, components: [] })).toThrowError();
		});
		test('GIVEN valid builder options THEN valid JSON output is given', () => {
			const rowWithButtonData: APIActionRowComponent<APIMessageComponent> = {
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

			const rowWithSelectMenuData: APIActionRowComponent<APIMessageComponent> = {
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

			const button = new ButtonComponent().setLabel('test').setStyle(ButtonStyle.Primary).setCustomId('123');
			const selectMenu = new SelectMenuComponent()
				.setCustomId('1234')
				.setMaxValues(10)
				.setMinValues(12)
				.setOptions([
					new SelectMenuOption().setLabel('one').setValue('one'),
					new SelectMenuOption().setLabel('two').setValue('two'),
				]);

			expect(new ActionRow().addComponents(button).toJSON()).toEqual(rowWithButtonData);
			expect(new ActionRow().addComponents(selectMenu).toJSON()).toEqual(rowWithSelectMenuData);
		});
	});
});
