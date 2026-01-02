import { UserFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link User#flags} bitfield.
 */
export class UserFlagsBitField extends BitField<keyof typeof UserFlags> {
	/**
	 * Numeric user flags.
	 */
	public static override readonly Flags = UserFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
