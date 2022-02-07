import type { APIMessageComponent, ComponentType } from 'discord-api-types/v9';
import type { JSONEncodable } from '../util/jsonEncodable';

/**
 * Represents a discord component
 */
export interface Component extends JSONEncodable<APIMessageComponent> {
	/**
	 * The type of this component
	 */
	readonly type: ComponentType;
}
