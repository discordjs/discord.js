import { BitField } from './BitField.js';

/**
 * Flags describing a lobby member's capabilities.
 *
 * @remarks Defined locally because discord-api-types 0.38.57 does not include lobby flags. The values use bigint for
 * compatibility with {@link BitField}; the API represents these flags as an integer.
 * @see {@link https://docs.discord.com/developers/resources/lobby#lobby-member-flags}
 */
export const LobbyMemberFlags = {
	/** The member can link a text channel to the lobby. */
	CanLinkLobby: 1n << 0n,
} as const;

/**
 * Data structure that makes it easy to interact with a {@link LobbyMember#flags} bitfield.
 */
export class LobbyMemberFlagsBitField extends BitField<keyof typeof LobbyMemberFlags> {
	/**
	 * Lobby member flag values.
	 */
	public static override readonly Flags = LobbyMemberFlags;

	public override toJSON() {
		return super.toJSON(true);
	}
}
