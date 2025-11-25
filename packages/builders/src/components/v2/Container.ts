/* eslint-disable jsdoc/check-param-names */

import type {
	APIActionRowComponent,
	APIComponentInContainer,
	APIComponentInMessageActionRow,
	APIContainerComponent,
	APIFileComponent,
	APIMediaGalleryComponent,
	APISectionComponent,
	APISeparatorComponent,
	APITextDisplayComponent,
} from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import type { RGBTuple } from '../../index.js';
import { MediaGalleryBuilder, SectionBuilder } from '../../index.js';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import type { AnyComponentBuilder, MessageActionRowComponentBuilder } from '../ActionRow.js';
import { ActionRowBuilder } from '../ActionRow.js';
import { ComponentBuilder } from '../Component.js';
import { createComponentBuilder, resolveBuilder } from '../Components.js';
import { containerColorPredicate, spoilerPredicate } from './Assertions.js';
import { FileBuilder } from './File.js';
import { SeparatorBuilder } from './Separator.js';
import { TextDisplayBuilder } from './TextDisplay.js';

/**
 * The builders that may be used within a container.
 */
export type ContainerComponentBuilder =
	| ActionRowBuilder<AnyComponentBuilder>
	| FileBuilder
	| MediaGalleryBuilder
	| SectionBuilder
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
	 * 	.addSeparatorComponents(separator).addSectionComponents(section);
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
	public setAccentColor(color?: RGBTuple | number): this {
		// Data assertions
		containerColorPredicate.parse(color);

		if (Array.isArray(color)) {
			const [red, green, blue] = color;
			this.data.accent_color = (red << 16) + (green << 8) + blue;
			return this;
		}

		this.data.accent_color = color;
		return this;
	}

	/**
	 * Clears the accent color of this container.
	 */
	public clearAccentColor() {
		this.data.accent_color = undefined;
		return this;
	}

	/**
	 * Adds action row components to this container.
	 *
	 * @param components - The action row components to add
	 */
	public addActionRowComponents<ComponentType extends MessageActionRowComponentBuilder>(
		...components: RestOrArray<
			| ActionRowBuilder<ComponentType>
			| APIActionRowComponent<APIComponentInMessageActionRow>
			| ((builder: ActionRowBuilder<ComponentType>) => ActionRowBuilder<ComponentType>)
		>
	) {
		this.components.push(
			...normalizeArray(components).map((component) => resolveBuilder(component, ActionRowBuilder<ComponentType>)),
		);
		return this;
	}

	/**
	 * Adds file components to this container.
	 *
	 * @param components - The file components to add
	 */
	public addFileComponents(
		...components: RestOrArray<APIFileComponent | FileBuilder | ((builder: FileBuilder) => FileBuilder)>
	) {
		this.components.push(...normalizeArray(components).map((component) => resolveBuilder(component, FileBuilder)));
		return this;
	}

	/**
	 * Adds media gallery components to this container.
	 *
	 * @param components - The media gallery components to add
	 */
	public addMediaGalleryComponents(
		...components: RestOrArray<
			APIMediaGalleryComponent | MediaGalleryBuilder | ((builder: MediaGalleryBuilder) => MediaGalleryBuilder)
		>
	) {
		this.components.push(
			...normalizeArray(components).map((component) => resolveBuilder(component, MediaGalleryBuilder)),
		);
		return this;
	}

	/**
	 * Adds section components to this container.
	 *
	 * @param components - The section components to add
	 */
	public addSectionComponents(
		...components: RestOrArray<APISectionComponent | SectionBuilder | ((builder: SectionBuilder) => SectionBuilder)>
	) {
		this.components.push(...normalizeArray(components).map((component) => resolveBuilder(component, SectionBuilder)));
		return this;
	}

	/**
	 * Adds separator components to this container.
	 *
	 * @param components - The separator components to add
	 */
	public addSeparatorComponents(
		...components: RestOrArray<
			APISeparatorComponent | SeparatorBuilder | ((builder: SeparatorBuilder) => SeparatorBuilder)
		>
	) {
		this.components.push(...normalizeArray(components).map((component) => resolveBuilder(component, SeparatorBuilder)));
		return this;
	}

	/**
	 * Adds text display components to this container.
	 *
	 * @param components - The text display components to add
	 */
	public addTextDisplayComponents(
		...components: RestOrArray<
			APITextDisplayComponent | TextDisplayBuilder | ((builder: TextDisplayBuilder) => TextDisplayBuilder)
		>
	) {
		this.components.push(
			...normalizeArray(components).map((component) => resolveBuilder(component, TextDisplayBuilder)),
		);
		return this;
	}

	/**
	 * Removes, replaces, or inserts components for this container.
	 *
	 * @param index - The index to start removing, replacing or inserting components
	 * @param deleteCount - The amount of components to remove
	 * @param components - The components to set
	 */
	public spliceComponents(
		index: number,
		deleteCount: number,
		...components: RestOrArray<APIComponentInContainer | ContainerComponentBuilder>
	) {
		this.components.splice(
			index,
			deleteCount,
			...normalizeArray(components).map((component) =>
				component instanceof ComponentBuilder ? component : createComponentBuilder(component),
			),
		);
		return this;
	}

	/**
	 * Sets the spoiler status of this container.
	 *
	 * @param spoiler - The spoiler status to use
	 */
	public setSpoiler(spoiler = true) {
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
