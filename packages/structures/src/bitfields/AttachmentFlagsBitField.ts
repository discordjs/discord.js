import { AttachmentFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link Attachment#flags} bitfield.
 */
export class AttachmentFlagsBitField extends BitField<keyof AttachmentFlags> {
	/**
	 * Numeric attachment flags.
	 */
	public static override readonly Flags = AttachmentFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
