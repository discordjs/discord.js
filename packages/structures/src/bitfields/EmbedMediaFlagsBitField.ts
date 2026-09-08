import { EmbedMediaFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link EmbedImage#flags} bitfield.
 */
export class EmbedMediaFlagsBitField extends BitField<keyof typeof EmbedMediaFlags> {
	/**
	 * Numeric embed media flags.
	 */
	public static override readonly Flags = EmbedMediaFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
