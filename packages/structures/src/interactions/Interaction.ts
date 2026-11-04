import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIInteraction, InteractionType } from 'discord-api-types/v10';
import { PermissionsBitField } from '../bitfields/PermissionsBitField.js';
import { Structure } from '../Structure.js';
import { kAppPermissions, kData } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { ReplaceOmittedWithUnknown } from '../utils/types.js';
import type { InteractionDataType, PartializeInteraction } from './types.js';

/**
 * Represents an incoming interaction, without client, cache, or response behavior.
 *
 * @typeParam Type - The interaction type represented by this envelope
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `data` field contains `ApplicationCommandInteractionData`, `AutocompleteInteractionData`,
 * `MessageComponentInteractionData`, or `ModalSubmitInteractionData`. The raw `guild`, `channel`, `member`, `user`,
 * `message`, and `entitlements` fields contain `Guild`, `Channel`, `GuildMember`, `User`, `Message`, and `Entitlement`
 * substructures. An extending class must construct and store them and may expose its own getters for them.
 * The raw installation owner map is preserved in `authorizing_integration_owners`.
 * @see {@link https://docs.discord.com/developers/interactions/receiving-and-responding#interaction-object}
 */
export class Interaction<
	Type extends InteractionType = InteractionType,
	Omitted extends keyof InteractionDataType<Type> | '' = 'app_permissions',
> extends Structure<InteractionDataType<Type>, Omitted | 'app_permissions'> {
	/**
	 * The template used to omit the optimized permission string from the stored raw data.
	 */
	public static override readonly DataTemplate: Partial<APIInteraction> = {
		set app_permissions(_value: string) {},
	};

	protected [kAppPermissions]: bigint | null = null;

	/**
	 * @param data - The raw incoming API interaction
	 */
	public constructor(data: PartializeInteraction<InteractionDataType<Type>, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected override optimizeData(data: Partial<InteractionDataType<Type>>) {
		if ('app_permissions' in data) {
			this[kAppPermissions] = typeof data.app_permissions === 'string' ? BigInt(data.app_permissions) : null;
		}
	}

	/**
	 * The interaction's id
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The id of the application receiving the interaction
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * The type of incoming interaction
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * The id of the guild in which the interaction was invoked, if any
	 */
	public get guildId() {
		return this[kData].guild_id;
	}

	/**
	 * The channel id supplied in the API envelope, if any
	 */
	public get channelId(): ReplaceOmittedWithUnknown<Omitted, InteractionDataType<Type>>['channel_id'] {
		return this[kData].channel_id as ReplaceOmittedWithUnknown<Omitted, InteractionDataType<Type>>['channel_id'];
	}

	/**
	 * The continuation token supplied by Discord
	 */
	public get token() {
		return this[kData].token;
	}

	/**
	 * The interaction protocol version
	 */
	public get version() {
		return this[kData].version;
	}

	/**
	 * The application's permissions in the source location, or null if omitted
	 */
	public get appPermissions() {
		const permissions = this[kAppPermissions];
		return permissions === null ? null : new PermissionsBitField(permissions);
	}

	/**
	 * The guild's preferred locale, if invoked in a guild
	 */
	public get guildLocale() {
		return this[kData].guild_locale;
	}

	/**
	 * The context in which the interaction was invoked, if supplied
	 */
	public get context() {
		return this[kData].context;
	}

	/**
	 * The attachment size limit in bytes
	 */
	public get attachmentSizeLimit() {
		return this[kData].attachment_size_limit;
	}

	/**
	 * The timestamp encoded in the interaction's snowflake
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time encoded in the interaction's snowflake
	 */
	public get createdDate() {
		const timestamp = this.createdTimestamp;
		return timestamp === null ? null : new Date(timestamp);
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const data = super.toJSON();
		if (this[kAppPermissions] !== null) {
			data.app_permissions = this[kAppPermissions].toString();
		}
		return data;
	}
}
