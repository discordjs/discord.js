import type { REST } from '@discordjs/rest';
import type {
	APIThreadChannel,
	APIThreadMember,
	RESTPostAPIChannelThreadsJSONBody,
	RESTPostAPIGuildForumThreadsJSONBody,
} from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

export interface StartThreadOptions extends RESTPostAPIChannelThreadsJSONBody {
	message_id?: string;
}

export const threads = (api: REST) => ({
	async fetch(channelId: string, threadId: string) {
		return (await api.get(Routes.threads(channelId, threadId))) as APIThreadChannel;
	},

	async start(channelId: string, options: StartThreadOptions) {
		const { message_id, ...body } = options;
		return (await api.post(Routes.threads(channelId, options?.message_id), {
			body,
		})) as APIThreadChannel;
	},

	async startForumThread(channelId: string, options: RESTPostAPIGuildForumThreadsJSONBody) {
		return (await api.post(Routes.threads(channelId), {
			body: options,
		})) as APIThreadChannel;
	},

	async join(threadId: string) {
		return api.put(Routes.threadMembers(threadId, '@me'));
	},

	async addMember(threadId: string, userId: string) {
		return api.put(Routes.threadMembers(threadId, userId));
	},

	async leave(threadId: string) {
		return api.delete(Routes.threadMembers(threadId, '@me'));
	},

	async removeMember(threadId: string, userId: string) {
		return api.delete(Routes.threadMembers(threadId, userId));
	},

	async fetchMember(threadId: string, userId: string) {
		return (await api.get(Routes.threadMembers(threadId, userId))) as APIThreadMember;
	},

	async fetchMembers(threadId: string) {
		return (await api.get(Routes.threadMembers(threadId))) as APIThreadMember[];
	},
});
