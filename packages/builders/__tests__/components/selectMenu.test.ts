import { ComponentType, type APISelectMenuComponent, type APISelectMenuOption } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from '../../src/index.js';

const selectMenu = () => new StringSelectMenuBuilder();
const selectMenuOption = () => new StringSelectMenuOptionBuilder();

const longStr = 'a'.repeat(256);

const selectMenuOptionData: APISelectMenuOption = {
	label: 'test',
	value: 'test',
	emoji: { name: 'test' },
	default: true,
	description: 'test',
};

const selectMenuDataWithoutOptions = {
	type: ComponentType.SelectMenu,
	custom_id: 'test',
	max_values: 10,
	min_values: 3,
	disabled: true,
	placeholder: 'test',
} as const;

const selectMenuData: APISelectMenuComponent = {
	...selectMenuDataWithoutOptions,
	options: [selectMenuOptionData],
};

function makeStringSelectMenuWithOptions() {
	const selectMenu = new StringSelectMenuBuilder();
	selectMenu.addOptions(
		{ label: 'foo', value: 'bar' },
		{ label: 'foo2', value: 'bar2' },
		{ label: 'foo3', value: 'bar3' },
	);
	return selectMenu;
}

function mapStringSelectMenuOptionBuildersToJson(selectMenu: StringSelectMenuBuilder) {
	return selectMenu.options.map((option) => option.toJSON());
}

describe('Select Menu Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid inputs THEN Select Menu does not throw', () => {
			expect(() => selectMenu().setCustomId('foo')).not.toThrowError();
			expect(() => selectMenu().setMaxValues(10)).not.toThrowError();
			expect(() => selectMenu().setMinValues(3)).not.toThrowError();
			expect(() => selectMenu().setDisabled(true)).not.toThrowError();
			expect(() => selectMenu().setDisabled()).not.toThrowError();
			expect(() => selectMenu().setPlaceholder('description')).not.toThrowError();
			const option = selectMenuOption()
				.setLabel('test')
				.setValue('test')
				.setDefault(true)
				.setEmoji({ name: 'test' })
				.setDescription('description');
			expect(() => selectMenu().addOptions(option)).not.toThrowError();
			expect(() => selectMenu().setOptions(option)).not.toThrowError();
			expect(() => selectMenu().setOptions({ label: 'test', value: 'test' })).not.toThrowError();
			expect(() => selectMenu().addOptions([option])).not.toThrowError();
			expect(() => selectMenu().setOptions([option])).not.toThrowError();
			expect(() => selectMenu().setOptions([{ label: 'test', value: 'test' }])).not.toThrowError();
			expect(() =>
				selectMenu()
					.addOptions({
						label: 'test',
						value: 'test',
						emoji: {
							id: '123',
							name: 'test',
							animated: true,
						},
					})
					.addOptions([
						{
							label: 'test',
							value: 'test',
							emoji: {
								id: '123',
								name: 'test',
								animated: true,
							},
						},
					]),
			).not.toThrowError();

			const options = Array.from<APISelectMenuOption>({ length: 25 }).fill({ label: 'test', value: 'test' });

			expect(() => selectMenu().addOptions(...options)).not.toThrowError();
			expect(() => selectMenu().setOptions(...options)).not.toThrowError();
			expect(() => selectMenu().addOptions(options)).not.toThrowError();
			expect(() => selectMenu().setOptions(options)).not.toThrowError();

			expect(() =>
				selectMenu()
					.addOptions({ label: 'test', value: 'test' })

					.addOptions(...Array.from<APISelectMenuOption>({ length: 24 }).fill({ label: 'test', value: 'test' })),
			).not.toThrowError();
			expect(() =>
				selectMenu()
					.addOptions([{ label: 'test', value: 'test' }])
					.addOptions(Array.from<APISelectMenuOption>({ length: 24 }).fill({ label: 'test', value: 'test' })),
			).not.toThrowError();
		});

		test('GIVEN invalid inputs THEN Select Menu does throw', () => {
			expect(() => selectMenu().setCustomId(longStr)).toThrowError();
			expect(() => selectMenu().setMaxValues(30)).toThrowError();
			expect(() => selectMenu().setMinValues(-20)).toThrowError();
			// @ts-expect-error: Invalid disabled value
			expect(() => selectMenu().setDisabled(0)).toThrowError();
			expect(() => selectMenu().setPlaceholder(longStr)).toThrowError();
			// @ts-expect-error: Invalid option
			expect(() => selectMenu().addOptions({ label: 'test' })).toThrowError();
			expect(() => selectMenu().addOptions({ label: longStr, value: 'test' })).toThrowError();
			expect(() => selectMenu().addOptions({ value: longStr, label: 'test' })).toThrowError();
			expect(() => selectMenu().addOptions({ label: 'test', value: 'test', description: longStr })).toThrowError();
			// @ts-expect-error: Invalid option
			expect(() => selectMenu().addOptions({ label: 'test', value: 'test', default: 100 })).toThrowError();
			// @ts-expect-error: Invalid option
			expect(() => selectMenu().addOptions({ value: 'test' })).toThrowError();
			// @ts-expect-error: Invalid option
			expect(() => selectMenu().addOptions({ default: true })).toThrowError();
			// @ts-expect-error: Invalid option
			expect(() => selectMenu().addOptions([{ label: 'test' }])).toThrowError();
			expect(() => selectMenu().addOptions([{ label: longStr, value: 'test' }])).toThrowError();
			expect(() => selectMenu().addOptions([{ value: longStr, label: 'test' }])).toThrowError();
			expect(() => selectMenu().addOptions([{ label: 'test', value: 'test', description: longStr }])).toThrowError();
			// @ts-expect-error: Invalid option
			expect(() => selectMenu().addOptions([{ label: 'test', value: 'test', default: 100 }])).toThrowError();
			// @ts-expect-error: Invalid option
			expect(() => selectMenu().addOptions([{ value: 'test' }])).toThrowError();
			// @ts-expect-error: Invalid option
			expect(() => selectMenu().addOptions([{ default: true }])).toThrowError();

			const tooManyOptions = Array.from<APISelectMenuOption>({ length: 26 }).fill({ label: 'test', value: 'test' });

			expect(() => selectMenu().setOptions(...tooManyOptions)).toThrowError();
			expect(() => selectMenu().setOptions(tooManyOptions)).toThrowError();

			expect(() =>
				selectMenu()
					.addOptions({ label: 'test', value: 'test' })
					.addOptions(...tooManyOptions),
			).toThrowError();
			expect(() =>
				selectMenu()
					.addOptions([{ label: 'test', value: 'test' }])
					.addOptions(tooManyOptions),
			).toThrowError();

			expect(() => {
				selectMenuOption()
					.setLabel(longStr)
					.setValue(longStr)
					// @ts-expect-error: Invalid default value
					.setDefault(-1)
					// @ts-expect-error: Invalid emoji
					.setEmoji({ name: 1 })
					.setDescription(longStr);
			}).toThrowError();
		});

		test('GIVEN valid option types THEN does not throw', () => {
			expect(() =>
				selectMenu().addOptions({
					label: 'test',
					value: 'test',
				}),
			).not.toThrowError();

			expect(() => selectMenu().addOptions(selectMenuOption().setLabel('test').setValue('test'))).not.toThrowError();
		});

		test('GIVEN valid JSON input THEN valid JSON history is correct', () => {
			expect(
				new StringSelectMenuBuilder(selectMenuDataWithoutOptions)
					.addOptions(new StringSelectMenuOptionBuilder(selectMenuOptionData))
					.toJSON(),
			).toEqual(selectMenuData);
			expect(
				new StringSelectMenuBuilder(selectMenuDataWithoutOptions)
					.addOptions([new StringSelectMenuOptionBuilder(selectMenuOptionData)])
					.toJSON(),
			).toEqual(selectMenuData);
			expect(new StringSelectMenuOptionBuilder(selectMenuOptionData).toJSON()).toEqual(selectMenuOptionData);
		});

		test('GIVEN a StringSelectMenuBuilder using StringSelectMenuBuilder#spliceOptions works', () => {
			expect(
				mapStringSelectMenuOptionBuildersToJson(makeStringSelectMenuWithOptions().spliceOptions(0, 1)),
			).toStrictEqual([
				{ label: 'foo2', value: 'bar2' },
				{ label: 'foo3', value: 'bar3' },
			]);

			expect(
				mapStringSelectMenuOptionBuildersToJson(
					makeStringSelectMenuWithOptions().spliceOptions(0, 1, selectMenuOptionData),
				),
			).toStrictEqual([selectMenuOptionData, { label: 'foo2', value: 'bar2' }, { label: 'foo3', value: 'bar3' }]);

			expect(
				mapStringSelectMenuOptionBuildersToJson(
					makeStringSelectMenuWithOptions().spliceOptions(0, 3, selectMenuOptionData),
				),
			).toStrictEqual([selectMenuOptionData]);

			expect(() =>
				makeStringSelectMenuWithOptions().spliceOptions(
					0,
					0,
					...Array.from({ length: 26 }, () => selectMenuOptionData),
				),
			).toThrowError();

			expect(() =>
				makeStringSelectMenuWithOptions()
					.setOptions(Array.from({ length: 25 }, () => selectMenuOptionData))
					.spliceOptions(-1, 2, selectMenuOptionData, selectMenuOptionData),
			).toThrowError();
		});
	});
});
