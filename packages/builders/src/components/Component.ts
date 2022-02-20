import type { JSONEncodable } from '../util/jsonEncodable';
import type {
	APIActionRowComponentTypes,
	APIBaseComponent,
	APIMessageComponent,
	ComponentType,
} from 'discord-api-types/v9';
import type { Equatable } from '../util/equatable';

/**
 * Represents a discord component
 */
export abstract class Component<
	DataType extends Partial<APIBaseComponent<ComponentType>> & {
		type: ComponentType;
	} = APIBaseComponent<ComponentType>,
> implements JSONEncodable<APIMessageComponent>, Equatable<Component | APIActionRowComponentTypes>
{
	/**
	 * The API data associated with this component
	 */
	public readonly data: DataType;

	public abstract toJSON(): APIMessageComponent;

	public abstract equals(other: Component | APIActionRowComponentTypes): boolean;

	public constructor(data: DataType) {
		this.data = data;
	}

	/**
	 * The type of this component
	 */
	public get type(): DataType['type'] {
		return this.data.type;
	}
}
