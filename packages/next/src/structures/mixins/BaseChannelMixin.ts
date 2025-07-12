/* eslint-disable @typescript-eslint/dot-notation */
import { equal } from 'node:assert';
import type { ChannelType } from '@discordjs/core';
import { kPatch, type Channel, type ChannelDataType } from '@discordjs/structures';
import type { Client } from '../../Client.js';

export interface BaseChannelMixin<Type extends ChannelType = ChannelType> extends Channel<Type> {}

export class BaseChannelMixin<Type extends ChannelType = ChannelType> {
	declare public readonly client: Client;

	public async delete() {
		await this.client['core'].api.channels.delete(this.id);
		return this;
	}

	public async fetch() {
		const data = await this.client['core'].api.channels.get(this.id);

		equal(data.type, this.type);
		return this[kPatch](data as ChannelDataType<Type>);
	}
}
