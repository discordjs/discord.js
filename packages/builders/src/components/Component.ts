import type { JSONEncodable } from '@discordjs/util';
import type { APIActionRowComponent, APIComponentInActionRow, APIMessageComponent } from 'discord-api-types/v10';

/**
 * Any action row component data represented as an object.
 */
export type AnyMessageComponent =
	// this action row type represents modals as wel
	APIActionRowComponent<APIActionRowComponentTypes> | APIActionRowComponentTypes | APIMessageComponent;

/**
 * The base component builder that contains common symbols for all sorts of components.
 *
 * @typeParam Component - The type of API data that is stored within the builder
 */
export abstract class ComponentBuilder<Component extends AnyMessageComponent> implements JSONEncodable<Component> {
	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public abstract toJSON(validationOverride?: boolean): Component;
}
