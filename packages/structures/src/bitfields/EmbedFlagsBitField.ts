import { EmbedFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link Embed#flags} bitfield.
 */
export class EmbedFlagsBitField extends BitField<keyof typeof EmbedFlags> {
	/**
	 * Numeric embed flags.
	 */
	public static override readonly Flags = EmbedFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
