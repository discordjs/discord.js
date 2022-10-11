import type { Channel } from 'node:diagnostics_channel';
import type { REST } from '@discordjs/rest';
import { makeURLSearchParams } from '@discordjs/rest';
import type {
	APIFollowedChannel,
	APIInvite,
	APIMessage,
	RESTGetAPIChannelUsersThreadsArchivedResult,
	RESTPatchAPIChannelJSONBody,
	RESTPostAPIChannelInviteJSONBody,
} from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

export interface GetChannelMessagesOptions {
	after?: string;
	around?: string;
	before?: string;
	limit?: number;
}

export interface FetchThreadsOptions {
	before?: string;
	limit?: number;
}

export const channels = (api: REST) => ({
	async fetch(channelId: string) {
		return (await api.get(Routes.channel(channelId))) as Channel;
	},

	async edit(channelId: string, options: RESTPatchAPIChannelJSONBody) {
		return (await api.patch(Routes.channel(channelId), {
			body: options,
		})) as Channel;
	},

	async delete(channelId: string) {
		return (await api.delete(Routes.channel(channelId))) as Channel;
	},

	async messages(channelId: string, options?: GetChannelMessagesOptions) {
		return (await api.get(
			`${Routes.channelMessages(channelId)}${
				options ? makeURLSearchParams(options as Record<string, unknown>).toString() : ''
			}`,
		)) as APIMessage[];
	},

	async showTyping(channelId: string) {
		await api.post(Routes.channelTyping(channelId));
	},

	async pins(channelId: string) {
		return (await api.get(Routes.channelPins(channelId))) as APIMessage[];
	},

	async pin(channelId: string, messageId: string) {
		await api.put(Routes.channelPin(channelId, messageId));
	},

	async unpin(channelId: string, messageId: string) {
		await api.delete(Routes.channelPin(channelId, messageId));
	},

	async followAnnouncements(channelId: string, webhookChannelId: string) {
		return (await api.post(Routes.channelFollowers(channelId), {
			body: {
				webhook_channel_id: webhookChannelId,
			},
		})) as APIFollowedChannel;
	},

	async createInvite(channelId: string, options: RESTPostAPIChannelInviteJSONBody) {
		return (await api.post(Routes.channelInvites(channelId), {
			body: options,
		})) as APIInvite;
	},

	async fetchInvites(channelId: string) {
		return (await api.get(Routes.channelInvites(channelId))) as APIInvite[];
	},

	async fetchArchivedThreads(channelId: string, archivedStatus: 'private' | 'public', options?: FetchThreadsOptions) {
		return (await api.get(
			`${Routes.channelThreads(channelId, archivedStatus)}?${makeURLSearchParams(options as Record<string, unknown>)}`,
		)) as RESTGetAPIChannelUsersThreadsArchivedResult;
	},

	async fetchJoinedPrivateArchivedThreads(channelId: string, options?: FetchThreadsOptions) {
		return (await api.get(
			`${Routes.channelJoinedArchivedThreads(channelId)}?${makeURLSearchParams(options as Record<string, unknown>)}`,
		)) as RESTGetAPIChannelUsersThreadsArchivedResult;
	},
});
