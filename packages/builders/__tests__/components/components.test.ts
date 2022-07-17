import {
	APIActionRowComponent,
	APIButtonComponent,
	APIMessageActionRowComponent,
	APISelectMenuComponent,
	APITextInputComponent,
	ButtonStyle,
	ComponentType,
	TextInputStyle,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	ActionRowBuilder,
	ButtonBuilder,
	createComponentBuilder,
	SelectMenuBuilder,
	TextInputBuilder,
} from '../../src/index';

describe('createComponentBuilder', () => {
	test.each([ButtonBuilder, SelectMenuBuilder, TextInputBuilder])(
		'passing an instance of %j should return itself',
		(Builder) => {
			const builder = new Builder();
			expect(createComponentBuilder(builder)).toBe(builder);
		},
	);

	test('GIVEN an action row component THEN returns a ActionRowBuilder', () => {
		const actionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
			components: [],
			type: ComponentType.ActionRow,
		};

		expect(createComponentBuilder(actionRow)).toBeInstanceOf(ActionRowBuilder);
	});

	test('GIVEN a button component THEN returns a ButtonBuilder', () => {
		const button: APIButtonComponent = {
			custom_id: 'abc',
			style: ButtonStyle.Primary,
			type: ComponentType.Button,
		};

		expect(createComponentBuilder(button)).toBeInstanceOf(ButtonBuilder);
	});

	test('GIVEN a select menu component THEN returns a SelectMenuBuilder', () => {
		const selectMenu: APISelectMenuComponent = {
			custom_id: 'abc',
			options: [],
			type: ComponentType.SelectMenu,
		};

		expect(createComponentBuilder(selectMenu)).toBeInstanceOf(SelectMenuBuilder);
	});

	test('GIVEN a text input component THEN returns a TextInputBuilder', () => {
		const textInput: APITextInputComponent = {
			custom_id: 'abc',
			label: 'abc',
			style: TextInputStyle.Short,
			type: ComponentType.TextInput,
		};

		expect(createComponentBuilder(textInput)).toBeInstanceOf(TextInputBuilder);
	});

	test('GIVEN an unknown component type THEN throws error', () => {
		// @ts-expect-error
		expect(() => createComponentBuilder({ type: 'invalid' })).toThrowError();
	});
});
