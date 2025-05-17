import type { APIUser, ChannelType } from 'discord-api-types/v10';
import { User } from '../../users';
import type { Channel, ChannelDataType } from '../Channel';

export interface DMChannelMixin<Type extends ChannelType.DM | ChannelType.GroupDM> extends Channel<Type> {
	/**
	 * The recipients of this DM based channel.
	 */
	recipients: readonly User[] | null;
}

export class DMChannelMixin<Type extends ChannelType.DM | ChannelType.GroupDM> {
	public static DataTemplate: Partial<ChannelDataType<ChannelType.DM | ChannelType.GroupDM>> = {
		set recipients(_: APIUser[]) {},
	};

	/**
	 * {@inheritDoc Structure._optimizeData}
	 */
	protected _optimizeData(data: Partial<ChannelDataType<Type>>) {
		this.recipients = data.recipients
			? data.recipients.map((recipient) => new User(recipient))
			: (this.recipients ?? null);
	}

	/**
	 * The URL to this channel.
	 */
	public get url() {
		return `https://discord.com/channels/@me/${this.id}`;
	}

	/**
	 * Indiciates whether this channel is a DM or DM Group
	 */
	public isDMBased(): this is DMChannelMixin<Extract<Type, ChannelType.DM | ChannelType.GroupDM>> {
		return true;
	}

	protected _toJSON(data: Partial<ChannelDataType<Type>>) {
		if (this.recipients) {
			data.recipients = this.recipients.map((recipient) => recipient.toJSON());
		}
	}
}
