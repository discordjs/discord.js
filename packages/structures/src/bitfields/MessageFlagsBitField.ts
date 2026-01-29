import { MessageFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link Message#flags} bitfield.
 */
export class MessageFlagsBitField extends BitField<keyof typeof MessageFlags> {
	/**
	 * Numeric message flags.
	 */
	public static override readonly Flags = MessageFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
