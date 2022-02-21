import type { JSONEncodable } from '../util/jsonEncodable';
import type {
	APIActionRowComponent,
	APIActionRowComponentTypes,
	APIBaseComponent,
	APIMessageActionRowComponent,
	APIModalActionRowComponent,
	APIMessageComponent,
	ComponentType,
	APIModalComponent,
} from 'discord-api-types/v9';
import type { Equatable } from '../util/equatable';

/**
 * Represents a discord component
 */
export abstract class Component<
	DataType extends Partial<APIBaseComponent<ComponentType>> & {
		type: ComponentType;
	} = APIBaseComponent<ComponentType>,
> implements
		JSONEncodable<
			| APIModalComponent
			| APIMessageComponent
			| APIActionRowComponent<APIModalActionRowComponent | APIMessageActionRowComponent>
		>,
		Equatable<
			| Component
			| APIActionRowComponentTypes
			| APIActionRowComponent<APIModalActionRowComponent | APIMessageActionRowComponent>
		>
{
	/**
	 * The API data associated with this component
	 */
	public readonly data: DataType;

	public abstract toJSON():
		| APIActionRowComponentTypes
		| APIActionRowComponent<APIModalActionRowComponent | APIMessageActionRowComponent>;

	public abstract equals(
		other:
			| Component
			| APIActionRowComponentTypes
			| APIActionRowComponent<APIModalActionRowComponent | APIMessageActionRowComponent>,
	): boolean;

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
