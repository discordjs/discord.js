/* eslint-disable jsdoc/check-param-names */

import type { APISectionComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import type { ButtonBuilder, ThumbnailBuilder } from '../../index.js';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { ComponentBuilder } from '../Component.js';
import { createComponentBuilder } from '../Components.js';
import { accessoryPredicate } from './Assertions.js';
import type { TextDisplayBuilder } from './TextDisplay.js';

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
	private accessory: ButtonBuilder | ThumbnailBuilder | null;

	/**
	 * Creates a new container from API data.
	 *
	 * @param data - The API data to create this container with
	 * @example
	 * Creating a container from an API data object:
	 * ```ts
	 * const container = new ContainerBuilder({
	 * 	components: [
	 * 		{
	 * 			content: "Some text here",
	 * 			type: ComponentType.TextDisplay,
	 * 		},
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating a container using setters and API data:
	 * ```ts
	 * const container = new ContainerBuilder({
	 * 	components: [
	 * 		{
	 * 			content: "# Heading",
	 * 			type: ComponentType.TextDisplay,
	 * 		},
	 * 	],
	 * })
	 * 	.addComponents(separator, section);
	 * ```
	 */
	public constructor({ components, accessory, ...data }: Partial<APISectionComponent> = {}) {
		super({ type: ComponentType.Section, ...data });
		this.components = (components?.map((component) => createComponentBuilder(component)) ?? []) as ComponentBuilder[];
		this.accessory = accessory ? createComponentBuilder(accessory) : null;
	}

	/**
	 * Sets the accessory of this section.
	 *
	 * @param accessory - The accessory to use
	 */
	public setAccessory(accessory: ButtonBuilder | ThumbnailBuilder): this {
		this.accessory = accessory;
		return this;
	}

	/**
	 * Adds components to this container.
	 *
	 * @param components - The components to add
	 */
	public addComponents(...components: RestOrArray<TextDisplayBuilder>) {
		this.components.push(...normalizeArray(components));
		return this;
	}

	/**
	 * Sets components for this container.
	 *
	 * @param components - The components to set
	 */
	public setComponents(...components: RestOrArray<TextDisplayBuilder>) {
		this.components.splice(0, this.components.length, ...normalizeArray(components));
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APISectionComponent {
		return {
			...this.data,
			components: this.components.map((component) => component.toJSON()),
			accessory: accessoryPredicate.parse(this.accessory).toJSON(),
		} as APISectionComponent;
	}
}
