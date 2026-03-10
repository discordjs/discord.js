/**
 * Gateway capabilities bitfield.
 * Controls what data the gateway includes in the READY payload.
 * Values and defaults match discord.py-self's Capabilities class.
 *
 * Reference: discord.py-self/discord/flags.py (class Capabilities)
 */

export enum CapabilityFlags {
	/**
	 * Disable preloading of user notes in READY
	 */
	LAZY_USER_NOTES = 1,
	/**
	 * Disable implicit relationship updates
	 */
	NO_AFFINE_USER_IDS = 2,
	/**
	 * Versioned read states (object with version/partial)
	 */
	VERSIONED_READ_STATES = 4,
	/**
	 * Versioned user guild settings
	 */
	VERSIONED_USER_GUILD_SETTINGS = 8,
	/**
	 * Dehydrate READY payload (dedupe user objects to `users` array)
	 */
	DEDUPE_USER_OBJECTS = 16,
	/**
	 * Enable READY_SUPPLEMENTAL; requires DEDUPE_USER_OBJECTS
	 */
	PRIORITIZED_READY_PAYLOAD = 48,
	/**
	 * Multiple guild experiment populations
	 */
	MULTIPLE_GUILD_EXPERIMENT_POPULATIONS = 64,
	/**
	 * Non-channel read states (server events, server home, etc.)
	 */
	NON_CHANNEL_READ_STATES = 128,
	/**
	 * Auth token refresh via READY `auth_token` field
	 */
	AUTH_TOKEN_REFRESH = 256,
	/**
	 * Disable legacy user_settings; use proto settings instead
	 */
	USER_SETTINGS_PROTO = 512,
	/**
	 * Client caching v2 (guild properties subkey, data_mode, version)
	 */
	CLIENT_STATE_V2 = 1_024,
	/**
	 * Replace CHANNEL_UNREADS_UPDATE with PASSIVE_UPDATE_V1
	 */
	PASSIVE_GUILD_UPDATE = 2_048,
	/**
	 * Auto-connect to existing calls (deprecates CALL_CONNECT opcode)
	 */
	AUTO_CALL_CONNECT = 4_096,
	/**
	 * Debounce message reactions (MESSAGE_REACTION_ADD_MANY)
	 */
	DEBOUNCE_MESSAGE_REACTIONS = 8_192,
	/**
	 * Replace PASSIVE_UPDATE_V1 with PASSIVE_UPDATE_V2
	 */
	PASSIVE_GUILD_UPDATE_V2 = 16_384,
}

/**
 * Default capabilities matching discord.py-self Capabilities.default().
 * Excludes: NO_AFFINE_USER_IDS, PASSIVE_GUILD_UPDATE (v1), DEBOUNCE_MESSAGE_REACTIONS.
 */
export const DefaultCapabilities: number =
	CapabilityFlags.LAZY_USER_NOTES |
	CapabilityFlags.VERSIONED_READ_STATES |
	CapabilityFlags.VERSIONED_USER_GUILD_SETTINGS |
	CapabilityFlags.DEDUPE_USER_OBJECTS |
	CapabilityFlags.PRIORITIZED_READY_PAYLOAD |
	CapabilityFlags.MULTIPLE_GUILD_EXPERIMENT_POPULATIONS |
	CapabilityFlags.NON_CHANNEL_READ_STATES |
	CapabilityFlags.AUTH_TOKEN_REFRESH |
	CapabilityFlags.USER_SETTINGS_PROTO |
	CapabilityFlags.CLIENT_STATE_V2 |
	CapabilityFlags.AUTO_CALL_CONNECT |
	CapabilityFlags.PASSIVE_GUILD_UPDATE_V2;

export class Capabilities {
	public value: number;

	public constructor(value: number = DefaultCapabilities) {
		this.value = value;
	}

	public has(flag: CapabilityFlags): boolean {
		return (this.value & flag) === flag;
	}

	public add(flag: CapabilityFlags): this {
		this.value |= flag;
		return this;
	}

	public remove(flag: CapabilityFlags): this {
		this.value &= ~flag;
		return this;
	}
}
