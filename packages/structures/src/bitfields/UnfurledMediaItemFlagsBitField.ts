import { UnfurledMediaItemFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link UnfurledMediaItem#flags} bitfield.
 */
export class UnfurledMediaItemFlagsBitField extends BitField<keyof typeof UnfurledMediaItemFlags> {
	/**
	 * Numeric unfurled media item flags.
	 */
	public static override readonly Flags = UnfurledMediaItemFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
