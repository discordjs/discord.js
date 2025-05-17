import type { APIGroupDMChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { kData } from '../utils/symbols.js';
import { Channel } from './Channel.js';
import { ChannelOwnerMixin } from './mixins/ChannelOwnerMixin.js';
import { DMChannelMixin } from './mixins/DMChannelMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';

export interface GroupDMChannel<Omitted extends keyof APIGroupDMChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GroupDM>,
		[DMChannelMixin<ChannelType.GroupDM>, TextChannelMixin<ChannelType.GroupDM>, ChannelOwnerMixin<ChannelType.GroupDM>]
	> {}

export class GroupDMChannel<Omitted extends keyof APIGroupDMChannel | '' = ''> extends Channel<
	ChannelType.GroupDM,
	Omitted
> {
	public constructor(data: APIGroupDMChannel) {
		super(data);
		this._optimizeData(data);
	}

	/**
	 * The icon hash of the group DM.
	 */
	public get icon() {
		return this[kData].icon;
	}

	/**
	 * Whether the channel is managed by an application via the `gdm.join` OAuth2 scope.
	 */
	public get managed() {
		return this[kData].managed;
	}

	/**
	 * The application id of the group DM creator if it is bot-created.
	 */
	public get applicationId() {
		return this[kData].application_id;
	}
}

Mixin(GroupDMChannel, [DMChannelMixin, TextChannelMixin, ChannelOwnerMixin]);
