export abstract class ApplicationCommandNumericOptionMinMaxValueMixin {
	/**
	 * Sets the maximum number value of this option
	 *
	 * @param max - The maximum value this option can be
	 */
	public abstract setMaxValue(max: number): this;

	/**
	 * Sets the minimum number value of this option
	 *
	 * @param min - The minimum value this option can be
	 */
	public abstract setMinValue(min: number): this;
}
