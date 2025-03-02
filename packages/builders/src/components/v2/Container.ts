/* eslint-disable jsdoc/check-param-names */

import type { APIContainerComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import type { RGBTuple } from '../../index.js';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import type { ActionRowBuilder, AnyComponentBuilder } from '../ActionRow.js';
import { ComponentBuilder } from '../Component.js';
import { createComponentBuilder } from '../Components.js';
import { containerColorPredicate, spoilerPredicate } from './Assertions.js';
import type { FileBuilder } from './File.js';
import type { SeparatorBuilder } from './Separator.js';
import type { TextDisplayBuilder } from './TextDisplay.js';

/**
 * The builders that may be used within a container.
 */
export type ContainerComponentBuilder =
	| ActionRowBuilder<AnyComponentBuilder>
	| FileBuilder
	| SeparatorBuilder
	| TextDisplayBuilder;

/**
 * A builder that creates API-compatible JSON data for a container.
 */
export class ContainerBuilder extends ComponentBuilder<APIContainerComponent> {
	/**
	 * The components within this container.
	 */
	public readonly components: ContainerComponentBuilder[];

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
	public constructor({ components, ...data }: Partial<APIContainerComponent> = {}) {
		super({ type: ComponentType.Container, ...data });
		this.components = (components?.map((component) => createComponentBuilder(component)) ??
			[]) as ContainerComponentBuilder[];
	}

	/**
	 * Sets the accent color of this container.
	 *
	 * @param color - The color to use
	 */
	public setAccentColor(color?: RGBTuple | number | null | undefined): this {
		// Data assertions
		containerColorPredicate.parse(color);

		if (Array.isArray(color)) {
			const [red, green, blue] = color;
			this.data.accent_color = (red << 16) + (green << 8) + blue;
			return this;
		}

		this.data.accent_color = color ?? undefined;
		return this;
	}

	/**
	 * Adds components to this container.
	 *
	 * @param components - The components to add
	 */
	public addComponents(...components: RestOrArray<ContainerComponentBuilder>) {
		this.components.push(...normalizeArray(components));
		return this;
	}

	/**
	 * Sets components for this container.
	 *
	 * @param components - The components to set
	 */
	public setComponents(...components: RestOrArray<ContainerComponentBuilder>) {
		this.components.splice(0, this.components.length, ...normalizeArray(components));
		return this;
	}

	/**
	 * Sets the spoiler status of this container.
	 *
	 * @param spoiler - The spoiler status to use
	 */
	public setSpoiler(spoiler: boolean) {
		this.data.spoiler = spoilerPredicate.parse(spoiler);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APIContainerComponent {
		return {
			...this.data,
			components: this.components.map((component) => component.toJSON()),
		} as APIContainerComponent;
	}
}
