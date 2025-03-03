/* eslint-disable jsdoc/check-param-names */

import type {
	APIButtonComponent,
	APISectionComponent,
	APITextDisplayComponent,
	APIThumbnailComponent,
} from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { ButtonBuilder, ThumbnailBuilder } from '../../index.js';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { ComponentBuilder } from '../Component.js';
import { createComponentBuilder, resolveBuilder } from '../Components.js';
import { accessoryPredicate, assertReturnOfBuilder, validateComponentArray } from './Assertions.js';
import { TextDisplayBuilder } from './TextDisplay.js';

/**
 * A builder that creates API-compatible JSON data for a section.
 */
export class SectionBuilder extends ComponentBuilder<APISectionComponent> {
	/**
	 * The components within this section.
	 */
	public readonly components: ComponentBuilder[];

	/**
	 * The accessory of this section.
	 */
	public readonly accessory?: ButtonBuilder | ThumbnailBuilder;

	/**
	 * Creates a new section from API data.
	 *
	 * @param data - The API data to create this section with
	 * @example
	 * Creating a section from an API data object:
	 * ```ts
	 * const section = new SectionBuilder({
	 * 	components: [
	 * 		{
	 * 			content: "Some text here",
	 * 			type: ComponentType.TextDisplay,
	 * 		},
	 * 	],
	 *  accessory: {
	 *      media: {
	 *          url: 'https://cdn.discordapp.com/embed/avatars/3.png',
	 *      },
	 *  }
	 * });
	 * ```
	 * @example
	 * Creating a section using setters and API data:
	 * ```ts
	 * const section = new SectionBuilder({
	 * 	components: [
	 * 		{
	 * 			content: "# Heading",
	 * 			type: ComponentType.TextDisplay,
	 * 		},
	 * 	],
	 * })
	 * 	.setPrimaryButtonAccessory(button);
	 * ```
	 */
	public constructor({ components, accessory, ...data }: Partial<APISectionComponent> = {}) {
		super({ type: ComponentType.Section, ...data });
		this.components = (components?.map((component) => createComponentBuilder(component)) ?? []) as ComponentBuilder[];
		this.accessory = accessory ? createComponentBuilder(accessory) : undefined;
	}

	/**
	 * Sets the accessory of this section to a button.
	 *
	 * @param accessory - The accessory to use
	 */
	public setButtonAccessory(
		accessory: APIButtonComponent | ButtonBuilder | ((builder: ButtonBuilder) => ButtonBuilder),
	): this {
		Reflect.set(this, 'accessory', accessoryPredicate.parse(resolveBuilder(accessory, ButtonBuilder)));
		return this;
	}

	/**
	 * Sets the accessory of this section to a thumbnail.
	 *
	 * @param accessory - The accessory to use
	 */
	public setThumbnailAccessory(
		accessory: APIThumbnailComponent | ThumbnailBuilder | ((builder: ThumbnailBuilder) => ThumbnailBuilder),
	): this {
		Reflect.set(this, 'accessory', accessoryPredicate.parse(resolveBuilder(accessory, ThumbnailBuilder)));
		return this;
	}

	/**
	 * Adds text display components to this section.
	 *
	 * @param components - The text display components to add
	 */
	public addTextDisplayComponents(
		...components: RestOrArray<TextDisplayBuilder | ((builder: TextDisplayBuilder) => TextDisplayBuilder)>
	) {
		this.components.push(
			...normalizeArray(components).map((input) => {
				const result = resolveBuilder(input, TextDisplayBuilder);

				assertReturnOfBuilder(result, TextDisplayBuilder);
				return result;
			}),
		);
		return this;
	}

	/**
	 * Removes, replaces, or inserts text display components for this section.
	 *
	 * @param index - The index to start removing, replacing or inserting text display components
	 * @param deleteCount - The amount of text display components to remove
	 * @param components - The text display components to insert
	 */
	public spliceTextDisplayComponents(
		index: number,
		deleteCount: number,
		...components: RestOrArray<
			APITextDisplayComponent | TextDisplayBuilder | ((builder: TextDisplayBuilder) => TextDisplayBuilder)
		>
	) {
		this.components.splice(
			index,
			deleteCount,
			...normalizeArray(components).map((input) => {
				const result = resolveBuilder(input, TextDisplayBuilder);

				assertReturnOfBuilder(result, TextDisplayBuilder);
				return result;
			}),
		);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APISectionComponent {
		validateComponentArray(this.components, 1, 3, TextDisplayBuilder);
		return {
			...this.data,
			components: this.components.map((component) => component.toJSON()),
			accessory: accessoryPredicate.parse(this.accessory).toJSON(),
		} as APISectionComponent;
	}
}
