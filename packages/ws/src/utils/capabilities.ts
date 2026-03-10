/**
 * Gateway capabilities bitfield.
 * Controls what data the gateway includes in the READY payload.
 * Values and defaults match discord.py-self's Capabilities class.
 *
 * Reference: discord.py-self/discord/flags.py (class Capabilities)
 */

export enum CapabilityFlags {
	/** Disable preloading of user notes in READY */
	LAZY_USER_NOTES = 1 << 0,
	/** Disable implicit relationship updates */
	NO_AFFINE_USER_IDS = 1 << 1,
	/** Versioned read states (object with version/partial) */
	VERSIONED_READ_STATES = 1 << 2,
	/** Versioned user guild settings */
	VERSIONED_USER_GUILD_SETTINGS = 1 << 3,
	/** Dehydrate READY payload (dedupe user objects to `users` array) */
	DEDUPE_USER_OBJECTS = 1 << 4,
	/** Enable READY_SUPPLEMENTAL; requires DEDUPE_USER_OBJECTS */
	PRIORITIZED_READY_PAYLOAD = (1 << 5) | (1 << 4),
	/** Multiple guild experiment populations */
	MULTIPLE_GUILD_EXPERIMENT_POPULATIONS = 1 << 6,
	/** Non-channel read states (server events, server home, etc.) */
	NON_CHANNEL_READ_STATES = 1 << 7,
	/** Auth token refresh via READY `auth_token` field */
	AUTH_TOKEN_REFRESH = 1 << 8,
	/** Disable legacy user_settings; use proto settings instead */
	USER_SETTINGS_PROTO = 1 << 9,
	/** Client caching v2 (guild properties subkey, data_mode, version) */
	CLIENT_STATE_V2 = 1 << 10,
	/** Replace CHANNEL_UNREADS_UPDATE with PASSIVE_UPDATE_V1 */
	PASSIVE_GUILD_UPDATE = 1 << 11,
	/** Auto-connect to existing calls (deprecates CALL_CONNECT opcode) */
	AUTO_CALL_CONNECT = 1 << 12,
	/** Debounce message reactions (MESSAGE_REACTION_ADD_MANY) */
	DEBOUNCE_MESSAGE_REACTIONS = 1 << 13,
	/** Replace PASSIVE_UPDATE_V1 with PASSIVE_UPDATE_V2 */
	PASSIVE_GUILD_UPDATE_V2 = 1 << 14,
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

	constructor(value: number = DefaultCapabilities) {
		this.value = value;
	}

	has(flag: CapabilityFlags): boolean {
		return (this.value & flag) === flag;
	}

	add(flag: CapabilityFlags): this {
		this.value |= flag;
		return this;
	}

	remove(flag: CapabilityFlags): this {
		this.value &= ~flag;
		return this;
	}
}
