import { SKUFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with an {@link SKUFlags} bitfield.
 */
export class SKUFlagsBitField extends BitField<keyof typeof SKUFlags> {
	/**
	 * Numeric SKU flags.
	 */
	public static override readonly Flags = SKUFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
