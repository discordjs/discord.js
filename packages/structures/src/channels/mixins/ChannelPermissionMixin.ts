import type { APIOverwrite, ChannelType, GuildChannelType, ThreadChannelType } from 'discord-api-types/v10';
import { kData, kMixinConstruct, kPermissionOverwrite } from '../../utils/symbols';
import type { Channel, ChannelDataType } from '../Channel';
import { PermissionOverwrite } from '../PermissionOverwrite';

export interface ChannelPermissionMixin<
	Type extends Exclude<GuildChannelType, ChannelType.GuildDirectory | ThreadChannelType>,
> extends Channel<Type> {}

export class ChannelPermissionMixin<
	Type extends Exclude<GuildChannelType, ChannelType.GuildDirectory | ThreadChannelType>,
> {
	/**
	 * The explicit permission overwrites for members and roles
	 */
	declare protected [kPermissionOverwrite]: PermissionOverwrite[] | null;

	/**
	 * The template used for removing data from the raw data stored for each Channel.
	 */
	public static DataTemplate: Partial<
		ChannelDataType<Exclude<GuildChannelType, ChannelType.GuildDirectory | ThreadChannelType>>
	> = {
		set permission_overwrites(_: APIOverwrite[]) {},
	};

	public [kMixinConstruct]() {
		this[kPermissionOverwrite] ??= null;
	}

	/**
	 * {@inheritDoc Structure._optimizeData}
	 */
	protected _optimizeData(data: Partial<ChannelDataType<Type>>) {
		if (data.permission_overwrites) {
			this[kPermissionOverwrite] = data.permission_overwrites.map((overwrite) => new PermissionOverwrite(overwrite));
		}
	}

	/**
	 * The explicit permission overwrites for members and roles
	 */
	public get permissionOverwrites() {
		return this[kPermissionOverwrite];
	}

	/**
	 * The sorting position of the channel
	 */
	public get position() {
		return this[kData].position;
	}

	/**
	 * Indicates whether this channel can have permission overwrites
	 */
	public isPermissionCapabale(): this is ChannelPermissionMixin<
		Extract<Type, Exclude<GuildChannelType, ChannelType.GuildDirectory | ThreadChannelType>>
	> {
		return true;
	}

	/**
	 * Adds data from optimized properties omitted from [kData].
	 *
	 * @param data - the result of {@link Channel.toJSON}
	 */
	protected _toJSON(data: Partial<ChannelDataType<Type>>) {
		if (this[kPermissionOverwrite]) {
			data.permission_overwrites = this[kPermissionOverwrite].map((overwrite) => overwrite.toJSON());
		}
	}
}
