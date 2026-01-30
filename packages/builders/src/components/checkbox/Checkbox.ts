import type { APICheckboxComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { ComponentBuilder } from '../Component';
import { checkboxPredicate } from './Assertions';

/**
 * A builder that creates API-compatible JSON data for checkboxes.
 */
export class CheckboxBuilder extends ComponentBuilder<APICheckboxComponent> {
	/**
	 * Creates a new checkbox from API data.
	 *
	 * @param data - The API data to create this checkbox with
	 * @example
	 * Creating a checkbox from an API data object:
	 * ```ts
	 * const checkbox = new CheckboxBuilder({
	 * 	custom_id: 'accept_terms',
	 * 	default: false,
	 * });
	 * ```
	 * @example
	 * Creating a checkbox using setters and API data:
	 * ```ts
	 * const checkbox = new CheckboxBuilder()
	 * 	.setCustomId('subscribe_newsletter')
	 * 	.setDefault(true);
	 * ```
	 */
	public constructor(data?: Partial<APICheckboxComponent>) {
		super({ type: ComponentType.Checkbox, ...data });
	}

	/**
	 * Sets the custom ID of this checkbox.
	 *
	 * @param customId - The custom ID to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Sets whether this checkbox is checked by default.
	 *
	 * @param isDefault - Whether the checkbox should be checked by default
	 */
	public setDefault(isDefault: boolean) {
		this.data.default = isDefault;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(): APICheckboxComponent {
		checkboxPredicate.parse(this.data);
		return {
			...this.data,
		} as APICheckboxComponent;
	}
}
