import { GuildSystemChannelFlags } from 'discord-api-types/v10';
import { BitField } from './BitField';

/**
 * Data structure that makes it easy to interact with a {@link Guild#systemChannelFlags} bitfield.
 */
export class GuildSystemChannelFlagsBitField extends BitField<keyof typeof GuildSystemChannelFlags> {
	/**
	 * Numeric system channel flags.
	 */
	public static override readonly Flags = GuildSystemChannelFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
