import type { JSONEncodable } from '@discordjs/util';
import type {
	APIActionRowComponent,
	APIActionRowComponentTypes,
	APIBaseComponent,
	ComponentType,
} from 'discord-api-types/v10';

/**
 * Any action row component data represented as an object.
 */
export type AnyAPIActionRowComponent = APIActionRowComponent<APIActionRowComponentTypes> | APIActionRowComponentTypes;

/**
 * The base component builder that contains common symbols for all sorts of components.
 *
 * @typeParam DataType - The type of internal API data that is stored within the component
 */
export abstract class ComponentBuilder<
	DataType extends Partial<APIBaseComponent<ComponentType>> = APIBaseComponent<ComponentType>,
> implements JSONEncodable<AnyAPIActionRowComponent>
{
	/**
	 * The API data associated with this component.
	 */
	public readonly data: Partial<DataType>;

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * @remarks
	 * This method runs validations on the data before serializing it.
	 * As such, it may throw an error if the data is invalid.
	 */
	public abstract toJSON(): AnyAPIActionRowComponent;

	/**
	 * Constructs a new kind of component.
	 *
	 * @param data - The data to construct a component out of
	 */
	public constructor(data: Partial<DataType>) {
		this.data = data;
	}
}
