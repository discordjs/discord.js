import type { APICheckboxComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { checkboxPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for checkboxes.
 */
export class CheckboxBuilder extends ComponentBuilder<APICheckboxComponent> {
	/**
	 * @internal
	 */
	protected readonly data: Partial<APICheckboxComponent>;

	/**
	 * Creates a new checkbox.
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
	 * const checkbox = new CheckboxBuilder({
	 * 	custom_id: 'subscribe_newsletter',
	 * }).setDefault();
	 * ```
	 */
	public constructor(data: Partial<APICheckboxComponent> = {}) {
		super();
		this.data = { ...structuredClone(data), type: ComponentType.Checkbox };
	}

	/**
	 * Sets the custom id for this checkbox.
	 *
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Sets whether this checkbox is checked by default.
	 *
	 * @param isDefault - Whether this checkbox is checked by default
	 */
	public setDefault(isDefault = true) {
		this.data.default = isDefault;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(validationOverride?: boolean): APICheckboxComponent {
		const clone = structuredClone(this.data);
		validate(checkboxPredicate, clone, validationOverride);

		return clone as APICheckboxComponent;
	}
}
