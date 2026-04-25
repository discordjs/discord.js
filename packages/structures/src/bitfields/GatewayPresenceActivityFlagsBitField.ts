import { ActivityFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with an {@link ActivityFlags} bitfield.
 */
export class GatewayPresenceActivityFlagsBitField extends BitField<keyof typeof ActivityFlags> {
	/**
	 * Numeric gateway presence activity flags.
	 */
	public static override readonly Flags = ActivityFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
