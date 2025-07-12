import type { MixinTypes } from '@discordjs/structures';
import { Mixin, Channel as StructureChannel } from '@discordjs/structures';
import type { APIChannel } from 'discord-api-types/v10';
import type { Client } from '../Client.js';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface Channel extends MixinTypes<StructureChannel, [BaseChannelMixin]> {}

export class Channel extends StructureChannel {
	public readonly client: Client;

	public constructor(data: APIChannel, client: Client) {
		super(data);

		this.client = client;
	}
}

Mixin(Channel, [BaseChannelMixin]);
