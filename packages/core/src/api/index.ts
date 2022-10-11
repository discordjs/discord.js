import type { REST } from '@discordjs/rest';
import { bots } from './bot.js';
import { channels } from './channel.js';
import { guilds } from './guild.js';
import { guildMembers } from './guildMember.js';
import { guildTemplates } from './guildTemplate.js';
import { interactions } from './interactions.js';
import { invites } from './invite.js';
import { messages } from './message.js';
import { stickers } from './sticker.js';
import { threads } from './thread.js';
import { voice } from './voice.js';
import { webhooks } from './webhook.js';

export * from './bot.js';
export * from './guildMember.js';
export * from './guild.js';
export * from './message.js';
export * from './thread.js';
export * from './webhook.js';
export * from './channel.js';
export * from './interactions.js';
export * from './guildTemplate.js';
export * from './invite.js';
export * from './voice.js';
export * from './sticker.js';

export const api = (rest: REST) => ({
	bots: bots(rest),
	channels: channels(rest),
	guilds: guilds(rest),
	guildMembers: guildMembers(rest),
	guildTemplates: guildTemplates(rest),
	invites: invites(rest),
	messages: messages(rest),
	threads: threads(rest),
	webhooks: webhooks(rest),
	interactions: interactions(rest),
	stickers: stickers(rest),
	voice: voice(rest),
	rest,
});
