import { validateDescription, validateName } from '../Assertions';

export class SharedNameAndDescription {
	public readonly name!: string;
	public readonly description!: string;

	/**
	 * Sets the name
	 *
	 * @param name The name
	 */
	public setName(name: string): this {
		// Assert the name matches the conditions
		validateName(name);

		Reflect.set(this, 'name', name);

		return this;
	}

	/**
	 * Sets the description
	 *
	 * @param description The description
	 */
	public setDescription(description: string) {
		// Assert the description matches the conditions
		validateDescription(description);

		Reflect.set(this, 'description', description);

		return this;
	}
}
