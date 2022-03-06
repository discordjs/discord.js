import type {
	APIActionRowComponent,
	APIMessageActionRowComponent,
	APITextInputComponent,
	APIActionRowComponentTypes,
} from 'discord-api-types/v9';
import { ComponentBuilder } from './Component';

/**
 * This class is simply a class provided to match any future components that
 * may not be implemented in builders. This future-proofs by not throwing an error anytime an unknown
 * component type is encountered.
 */
export class UnknownComponentBuilder extends ComponentBuilder {
	public toJSON():
		| APIActionRowComponent<APIMessageActionRowComponent | APITextInputComponent>
		| APIActionRowComponentTypes {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return { ...this.data } as
			| APIActionRowComponent<APIMessageActionRowComponent | APITextInputComponent>
			| APIActionRowComponentTypes;
	}
}
