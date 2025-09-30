/**
 * Mixin used to provide {@link Refineable.refine}
 */
export class Refineable {
	/**
	 * Refines this builder by applying the provided function to itself.
	 * Useful for conditionally modifying the builder without breaking the method chain, while also isolating
	 * the scope of temporary variables.
	 *
	 * @example
	 * ```ts
	 * const builder = new EmbedBuilder()
	 *  .setTitle('Hello World')
	 *  .setDescription('This is a description')
	 *  .refine((b) => {
	 *      if (externalVariable) {
	 *         b.setColor('Red');
	 *     }
	 *  });
	 * ```
	 */
	public refine(fn: (builder: this) => void): this {
		fn(this);
		return this;
	}
}
