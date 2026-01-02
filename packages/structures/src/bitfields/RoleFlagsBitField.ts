import { RoleFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link Role#flags} bitfield.
 */
export class RoleFlagsBitField extends BitField<keyof typeof RoleFlags> {
	/**
	 * Numeric role flags.
	 */
	public static override readonly Flags = RoleFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
