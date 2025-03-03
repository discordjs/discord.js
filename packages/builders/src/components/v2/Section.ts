import type {
	APITextDisplayComponent,
	APISectionComponent,
	APIButtonComponentWithCustomId,
	APIThumbnailComponent,
	APIButtonComponentWithSKUId,
	APIButtonComponentWithURL,
} from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { resolveAccessoryComponent, type ButtonBuilder } from '../Components.js';
import {
	DangerButtonBuilder,
	PrimaryButtonBuilder,
	SecondaryButtonBuilder,
	SuccessButtonBuilder,
} from '../button/CustomIdButton.js';
import { LinkButtonBuilder } from '../button/LinkButton.js';
import { PremiumButtonBuilder } from '../button/PremiumButton.js';
import { sectionPredicate } from './Assertions.js';
import { TextDisplayBuilder } from './TextDisplay.js';
import { ThumbnailBuilder } from './Thumbnail.js';

export type SectionBuilderAccessory = ButtonBuilder | ThumbnailBuilder;

export interface SectionBuilderData extends Partial<Omit<APISectionComponent, 'accessory' | 'components'>> {
	accessory: SectionBuilderAccessory;
	components: TextDisplayBuilder[];
}

export class SectionBuilder extends ComponentBuilder<APISectionComponent> {
	private readonly data: SectionBuilderData;

	public get components(): readonly TextDisplayBuilder[] {
		return this.data.components;
	}

	public constructor({ components = [], accessory, ...rest }: Partial<APISectionComponent> = {}) {
		super();
		this.data = {
			...structuredClone(rest),
			// Nasty use of `!` here, but we will validate this in toJSON anyways
			accessory: accessory ? resolveAccessoryComponent(accessory) : undefined!,
			components: components.map((component) => new TextDisplayBuilder(component)),
			type: ComponentType.Section,
		};
	}

	/**
	 * Adds text display components to this section.
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
	 * Sets a primary button component to be the accessory of this section.
	 *
	 * @param input - The button to set as the accessory
	 */
	public setPrimaryButtonAccessory(
		input:
			| APIButtonComponentWithCustomId
			| PrimaryButtonBuilder
			| ((builder: PrimaryButtonBuilder) => PrimaryButtonBuilder),
	): this {
		const builder = resolveBuilder(input, PrimaryButtonBuilder);

		this.data.accessory = builder;
		return this;
	}

	/**
	 * Sets a secondary button component to be the accessory of this section.
	 *
	 * @param input - The button to set as the accessory
	 */
	public setSecondaryButtonAccessory(
		input:
			| APIButtonComponentWithCustomId
			| SecondaryButtonBuilder
			| ((builder: SecondaryButtonBuilder) => SecondaryButtonBuilder),
	): this {
		const builder = resolveBuilder(input, SecondaryButtonBuilder);

		this.data.accessory = builder;
		return this;
	}

	/**
	 * Sets a success button component to be the accessory of this section.
	 *
	 * @param input - The button to set as the accessory
	 */
	public setSuccessButtonAccessory(
		input:
			| APIButtonComponentWithCustomId
			| SuccessButtonBuilder
			| ((builder: SuccessButtonBuilder) => SuccessButtonBuilder),
	): this {
		const builder = resolveBuilder(input, SuccessButtonBuilder);

		this.data.accessory = builder;
		return this;
	}

	/**
	 * Sets a danger button component to be the accessory of this section.
	 *
	 * @param input - The button to set as the accessory
	 */
	public setDangerButtonAccessory(
		input:
			| APIButtonComponentWithCustomId
			| DangerButtonBuilder
			| ((builder: DangerButtonBuilder) => DangerButtonBuilder),
	): this {
		const builder = resolveBuilder(input, DangerButtonBuilder);

		this.data.accessory = builder;
		return this;
	}

	/**
	 * Sets a SKU id button component to be the accessory of this section.
	 *
	 * @param input - The button to set as the accessory
	 */
	public setPremiumButtonAccessory(
		input:
			| APIButtonComponentWithSKUId
			| PremiumButtonBuilder
			| ((builder: PremiumButtonBuilder) => PremiumButtonBuilder),
	): this {
		const builder = resolveBuilder(input, PremiumButtonBuilder);

		this.data.accessory = builder;
		return this;
	}

	/**
	 * Sets a URL button component to be the accessory of this section.
	 *
	 * @param input - The button to set as the accessory
	 */
	public setLinkButtonAccessory(
		input: APIButtonComponentWithURL | LinkButtonBuilder | ((builder: LinkButtonBuilder) => LinkButtonBuilder),
	): this {
		const builder = resolveBuilder(input, LinkButtonBuilder);

		this.data.accessory = builder;
		return this;
	}

	/**
	 * Sets a thumbnail component to be the accessory of this section.
	 *
	 * @param input - The thumbnail to set as the accessory
	 */
	public setThumbnailAccessory(
		input: APIThumbnailComponent | ThumbnailBuilder | ((builder: ThumbnailBuilder) => ThumbnailBuilder),
	): this {
		const builder = resolveBuilder(input, ThumbnailBuilder);

		this.data.accessory = builder;
		return this;
	}

	/**
	 * Removes, replaces, or inserts text display components for this section.
	 */
	public spliceTextDisplayComponents(index: number, deleteCount: number, ...components: TextDisplayBuilder[]): this {
		this.data.components.splice(index, deleteCount, ...components);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APISectionComponent {
		const { components, accessory, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			components: components.map((component) => component.toJSON(validationOverride)),
			accessory: accessory?.toJSON(validationOverride),
		};

		validate(sectionPredicate, data, validationOverride);

		return data as APISectionComponent;
	}
}
