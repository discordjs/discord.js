import type { JSONEncodable } from '@discordjs/util';
import type { APIBaseComponent, ComponentType } from 'discord-api-types/v10';
import { Refineable } from '../mixins/Refineable.js';

export interface ComponentBuilderBaseData {
	id?: number | undefined;
}

/**
 * The base component builder that contains common symbols for all sorts of components.
 *
 * @typeParam Component - The type of API data that is stored within the builder
 */
export abstract class ComponentBuilder<Component extends APIBaseComponent<ComponentType>>
	extends Refineable
	implements JSONEncodable<Component>
{
	/**
	 * @internal
	 */
	protected abstract readonly data: ComponentBuilderBaseData;

	/**
	 * Sets the id of this component.
	 *
	 * @param id - The id to use
	 */
	public setId(id: number) {
		this.data.id = id;
		return this;
	}

	/**
	 * Clears the id of this component, defaulting to a default incremented id.
	 */
	public clearId() {
		this.data.id = undefined;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public abstract toJSON(validationOverride?: boolean): Component;
}
