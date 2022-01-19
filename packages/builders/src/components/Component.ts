import type { APIMessageComponent, ComponentType } from 'discord-api-types/v9';

/**
 * Represents a discord component
 */
export interface Component {
	/**
	 * The type of this component
	 */
	readonly type: ComponentType;
	/**
	 * Converts this component to an API-compatible JSON object
	 */
	toJSON: () => APIMessageComponent;
}
