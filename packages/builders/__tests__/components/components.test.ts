import {
	ButtonStyle,
	ComponentType,
	TextInputStyle,
	type APIButtonComponent,
	type APISelectMenuComponent,
	type APITextInputComponent,
	type APIActionRowComponent,
	type APIComponentInMessageActionRow,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	ActionRowBuilder,
	createComponentBuilder,
	CustomIdButtonBuilder,
	StringSelectMenuBuilder,
	TextInputBuilder,
} from '../../src/index.js';

describe('createComponentBuilder', () => {
	test.each([StringSelectMenuBuilder, TextInputBuilder])(
		'passing an instance of %j should return itself',
		(Builder) => {
			const builder = new Builder();
			expect(createComponentBuilder(builder)).toBe(builder);
		},
	);

	test('GIVEN an action row component THEN returns a ActionRowBuilder', () => {
		const actionRow: APIActionRowComponent<APIComponentInMessageActionRow> = {
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

		expect(createComponentBuilder(button)).toBeInstanceOf(CustomIdButtonBuilder);
	});

	test('GIVEN a select menu component THEN returns a StringSelectMenuBuilder', () => {
		const selectMenu: APISelectMenuComponent = {
			custom_id: 'abc',
			options: [],
			type: ComponentType.StringSelect,
		};

		expect(createComponentBuilder(selectMenu)).toBeInstanceOf(StringSelectMenuBuilder);
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
		// @ts-expect-error: Unknown component type
		expect(() => createComponentBuilder({ type: 'invalid' })).toThrowError();
	});
});
