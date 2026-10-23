import {
	type APIComponentInMessageActionRow,
	type APISeparatorComponent,
	type APIActionRowComponent,
	type APIFileComponent,
	type APITextDisplayComponent,
	type APIContainerComponent,
	type APIComponentInContainer,
	type APIMediaGalleryComponent,
	type APISectionComponent,
	ComponentType,
} from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray';
import { resolveBuilder } from '../../util/resolveBuilder';
import { validate } from '../../util/validation';
import { ActionRowBuilder } from '../ActionRow.js';
import { ComponentBuilder } from '../Component.js';
import { createComponentBuilder } from '../Components';
import { containerPredicate } from './Assertions';
import { FileBuilder } from './File.js';
import { MediaGalleryBuilder } from './MediaGallery';
import { SectionBuilder } from './Section';
import { SeparatorBuilder } from './Separator.js';
import { TextDisplayBuilder } from './TextDisplay';

export type ContainerComponentBuilders =
	| ActionRowBuilder
	| FileBuilder
	| MediaGalleryBuilder
	| SectionBuilder
	| SeparatorBuilder
	| TextDisplayBuilder;

export interface ContainerBuilderData extends Partial<Omit<APIContainerComponent, 'components'>> {
	components: ContainerComponentBuilders[];
}

/**
 * A builder that creates API-compatible JSON data for containers.
 */
export class ContainerBuilder extends ComponentBuilder<APIContainerComponent> {
	/**
	 * @internal
	 */
	protected readonly data: ContainerBuilderData;

	/**
	 * Gets the components within this container.
	 */
	public get components(): readonly ContainerComponentBuilders[] {
		return this.data.components;
	}

	/**
	 * Creates a new container builder.
	 *
	 * @param data - The API data to create the container with
	 */
	public constructor(data: Partial<APIContainerComponent> = {}) {
		super();

		const { components = [], ...rest } = data;

		this.data = {
			...structuredClone(rest),
			components: components.map((component) => createComponentBuilder(component)),
			type: ComponentType.Container,
		};
	}

	/**
	 * Sets the accent color of this container.
	 *
	 * @param color - The color to use
	 */
	public setAccentColor(color: number) {
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
	 * Sets the spoiler status of this container.
	 *
	 * @param spoiler - The spoiler status to use
	 */
	public setSpoiler(spoiler = true) {
		this.data.spoiler = spoiler;
		return this;
	}

	/**
	 * Adds action row components to this container.
	 *
	 * @param input - The action row to add
	 */
	public addActionRowComponents(
		...input: RestOrArray<
			| ActionRowBuilder
			| APIActionRowComponent<APIComponentInMessageActionRow>
			| ((builder: ActionRowBuilder) => ActionRowBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, ActionRowBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds file components to this container.
	 *
	 * @param input - The file components to add
	 */
	public addFileComponents(
		...input: RestOrArray<APIFileComponent | FileBuilder | ((builder: FileBuilder) => FileBuilder)>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, FileBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds media gallery components to this container.
	 *
	 * @param input - The media gallery components to add
	 */
	public addMediaGalleryComponents(
		...input: RestOrArray<
			APIMediaGalleryComponent | MediaGalleryBuilder | ((builder: MediaGalleryBuilder) => MediaGalleryBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, MediaGalleryBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds section components to this container.
	 *
	 * @param input - The section components to add
	 */
	public addSectionComponents(
		...input: RestOrArray<APISectionComponent | SectionBuilder | ((builder: SectionBuilder) => SectionBuilder)>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, SectionBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds separator components to this container.
	 *
	 * @param input - The separator components to add
	 */
	public addSeparatorComponents(
		...input: RestOrArray<APISeparatorComponent | SeparatorBuilder | ((builder: SeparatorBuilder) => SeparatorBuilder)>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, SeparatorBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds text display components to this container.
	 *
	 * @param input - The text display components to add
	 */
	public addTextDisplayComponents(
		...input: RestOrArray<
			APITextDisplayComponent | TextDisplayBuilder | ((builder: TextDisplayBuilder) => TextDisplayBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, TextDisplayBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Removes, replaces, or inserts components for this container
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 *
	 * It's useful for modifying and adjusting order of the already-existing components of a container.
	 * @example
	 * Remove the first component:
	 * ```ts
	 * container.spliceComponents(0, 1);
	 * ```
	 * @example
	 * Remove the first n components:
	 * ```ts
	 * const n = 4;
	 * container.spliceComponents(0, n);
	 * ```
	 * @example
	 * Remove the last component:
	 * ```ts
	 * container.spliceComponents(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The number of components to remove
	 * @param components - The replacing component objects
	 */
	public spliceComponents(
		index: number,
		deleteCount: number,
		...components: RestOrArray<APIComponentInContainer | ContainerComponentBuilders>
	): this {
		const normalized = normalizeArray(components);
		const resolved = normalized.map((component) =>
			component instanceof ComponentBuilder ? component : createComponentBuilder(component),
		);

		this.data.components.splice(index, deleteCount, ...resolved);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APIContainerComponent {
		const { components, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			components: components.map((component) => component.toJSON(false)),
		};

		validate(containerPredicate, data, validationOverride);

		return data as APIContainerComponent;
	}
}
