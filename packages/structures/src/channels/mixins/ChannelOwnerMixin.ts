import type { ChannelType, ThreadChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import type { Channel } from '../Channel';

export interface ChannelOwnerMixin<Type extends ChannelType.GroupDM | ThreadChannelType> extends Channel<Type> {}

export class ChannelOwnerMixin<Type extends ChannelType.GroupDM | ThreadChannelType> {
	/**
	 * The id of the creator of the group DM or thread
	 */
	public get ownerId() {
		return this[kData].owner_id;
	}
}
