import type { APIMessageComponent, ComponentType } from 'discord-api-types/v9';
import type { JSONEncodable } from '../util/jsonEncodable';

/**
 * Represents a discord component
 */
export abstract class Component implements JSONEncodable<APIMessageComponent> {
	/**
	 * The api data associated with this component
	 */
	protected data!: APIMessageComponent;

	/**
	 * The type of this component
	 */
	public abstract readonly type: ComponentType;

	public constructor(data: APIMessageComponent & { type?: ComponentType } = {} as APIMessageComponent) {
		this.data = data;
	}

	public abstract toJSON(): APIMessageComponent;
}
