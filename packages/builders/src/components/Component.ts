import type { JSONEncodable } from '../util/jsonEncodable';
import type {
	APIActionRowComponent,
	APIActionRowComponentTypes,
	APIBaseComponent,
	APIMessageActionRowComponent,
	APIMessageComponent,
	APIModalActionRowComponent,
	APIModalComponent,
	ComponentType,
} from 'discord-api-types/v10';

/**
 * Represents a discord component
 */
export abstract class ComponentBuilder<
	DataType extends Partial<APIBaseComponent<ComponentType>> & {
		type: ComponentType;
	} = APIBaseComponent<ComponentType>,
> implements
		JSONEncodable<
			| APIModalComponent
			| APIMessageComponent
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

	public constructor(data: DataType) {
		this.data = data;
	}
}
