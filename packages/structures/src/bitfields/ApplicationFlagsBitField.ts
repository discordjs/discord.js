import { ApplicationFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link (Application:class).flags} bitfield.
 */
export class ApplicationFlagsBitField extends BitField<keyof ApplicationFlags> {
	/**
	 * Numeric application flags.
	 */
	public static override readonly Flags = ApplicationFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
