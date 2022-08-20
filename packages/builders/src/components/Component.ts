import type {
	APIActionRowComponent,
	APIActionRowComponentTypes,
	APIBaseComponent,
	ComponentType,
} from 'discord-api-types/v10';
import type { JSONEncodable } from '../util/jsonEncodable';

export type AnyAPIActionRowComponent = APIActionRowComponentTypes | APIActionRowComponent<APIActionRowComponentTypes>;

/**
 * Represents a discord component
 *
 * @typeParam DataType - The type of internal API data that is stored within the component
 */
export abstract class ComponentBuilder<
	DataType extends Partial<APIBaseComponent<ComponentType>> = APIBaseComponent<ComponentType>,
> implements JSONEncodable<AnyAPIActionRowComponent>
{
	/**
	 * The API data associated with this component
	 */
	public readonly data: Partial<DataType>;

	/**
	 * {@inheritDoc JSONEncodable.toJSON}
	 */
	public abstract toJSON(): AnyAPIActionRowComponent;

	public constructor(data: Partial<DataType>) {
		this.data = data;
	}
}
