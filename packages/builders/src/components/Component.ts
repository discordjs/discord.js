import type { JSONEncodable } from '@discordjs/util';
import type { APIBaseComponent, ComponentType } from 'discord-api-types/v10';

/**
 * The base component builder that contains common symbols for all sorts of components.
 *
 * @typeParam Component - The type of API data that is stored within the builder
 */
export abstract class ComponentBuilder<Component extends APIBaseComponent<ComponentType>>
	implements JSONEncodable<Component>
{
	protected abstract readonly data: { id?: number | undefined };

	/**
	 * Sets the id of this component.
	 *
	 * @param id - The id to use
	 */
	public setId(id: number) {
		this.data.id = id;
	}

	/**
	 * Clears the id of this component, defaulting to a default incremented id.
	 */
	public clearId() {
		this.data.id = undefined;
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
