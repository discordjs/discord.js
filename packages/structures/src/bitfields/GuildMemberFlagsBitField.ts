import { GuildMemberFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link GuildMember#flags} bitfield.
 */
export class GuildMemberFlagsBitField extends BitField<keyof GuildMemberFlags> {
	/**
	 * Numeric guild member flags.
	 */
	public static override readonly Flags = GuildMemberFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
