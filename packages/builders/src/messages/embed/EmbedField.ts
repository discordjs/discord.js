import type { JSONEncodable } from '@discordjs/util';
import type { APIEmbedField } from 'discord-api-types/v10';
import { Refineable } from '../../mixins/Refineable.js';
import { validate } from '../../util/validation.js';
import { embedFieldPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for embed fields.
 */
export class EmbedFieldBuilder extends Refineable implements JSONEncodable<APIEmbedField> {
	/**
	 * The API data associated with this embed field.
	 */
	private readonly data: Partial<APIEmbedField>;

	/**
	 * Creates a new embed field builder.
	 *
	 * @param data - The API data to create this embed field with
	 */
	public constructor(data: Partial<APIEmbedField> = {}) {
		super();
		this.data = { ...structuredClone(data) };
	}

	/**
	 * Sets the name for this embed field.
	 *
	 * @param name - The name to use
	 */
	public setName(name: string): this {
		this.data.name = name;
		return this;
	}

	/**
	 * Sets the value for this embed field.
	 *
	 * @param value - The value to use
	 */
	public setValue(value: string): this {
		this.data.value = value;
		return this;
	}

	/**
	 * Sets whether this field should display inline.
	 *
	 * @param inline - Whether this field should display inline
	 */
	public setInline(inline = true): this {
		this.data.inline = inline;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): APIEmbedField {
		const clone = structuredClone(this.data);
		validate(embedFieldPredicate, clone, validationOverride);

		return clone as APIEmbedField;
	}
}
