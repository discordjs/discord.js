import type { MixinTypes } from '@discordjs/structures';
import { Mixin, Channel as StructureChannel } from '@discordjs/structures';
import type { APIChannel } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface BaseChannel extends MixinTypes<StructureChannel, [BaseChannelMixin]> {}

export class BaseChannel extends StructureChannel {
	public constructor(data: APIChannel) {
		super(data);
	}
}

Mixin(BaseChannel, [BaseChannelMixin]);
