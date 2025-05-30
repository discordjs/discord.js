import { ChannelFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link BaseChannel#flags} bitfield.
 */
export class ChannelFlagsBitField extends BitField<keyof ChannelFlags> {
	/**
	 * Numeric guild channel flags.
	 */
	public static override Flags = ChannelFlags;
}
